/**
 * Statistics & Data Science Math Utilities
 * Robust calculations for Z-scores, normal distributions, linear regression, and correlation.
 */

/**
 * Standard Error Function erf(x) approximation (Abramowitz and Stegun formula 7.1.26)
 * Max error < 1.5e-7
 */
export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * a);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-a * a);

  return sign * y;
}

/**
 * Cumulative standard normal distribution function Φ(z) = P(Z <= z)
 */
export function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/**
 * Standard Normal Probability Density Function φ(z)
 */
export function standardNormalPdf(z: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
}

/**
 * Inverse of the standard normal cumulative distribution function (Quantile function / probit).
 * Uses rational approximation (Acklam algorithm).
 */
export function inverseNormalCdf(p: number): number {
  if (p <= 0 || p >= 1) {
    if (p <= 0) return -Infinity;
    return Infinity;
  }

  // Coefficients in rational approximations
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(
        (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
      )
    );
  }
}

export interface ZScoreResult {
  zScore: number;
  probabilityLess: number; // P(Z < z)
  probabilityGreater: number; // P(Z > z)
  probabilityBetweenOpposite: number; // P(-|z| < Z < |z|)
  percentile: number; // percentile rank 0 - 100
}

/**
 * Calculates Z-score and probabilities given raw value x, mean μ, and standard deviation σ
 */
export function calculateZScore(x: number, mean: number, stdDev: number): ZScoreResult {
  if (stdDev <= 0) {
    return {
      zScore: 0,
      probabilityLess: 0.5,
      probabilityGreater: 0.5,
      probabilityBetweenOpposite: 0,
      percentile: 50
    };
  }

  const z = (x - mean) / stdDev;
  const pLess = standardNormalCdf(z);
  const pGreater = 1 - pLess;
  const pBetween = Math.abs(standardNormalCdf(Math.abs(z)) - standardNormalCdf(-Math.abs(z)));

  return {
    zScore: Number(z.toFixed(4)),
    probabilityLess: Number(pLess.toFixed(5)),
    probabilityGreater: Number(pGreater.toFixed(5)),
    probabilityBetweenOpposite: Number(pBetween.toFixed(5)),
    percentile: Number((pLess * 100).toFixed(2))
  };
}

/**
 * Inverse Z-score: given probability/percentile, find raw score x = μ + Z*σ
 */
export function calculateInverseZScore(p: number, mean: number, stdDev: number): { zScore: number; x: number } {
  const prob = Math.max(0.00001, Math.min(0.99999, p));
  const z = inverseNormalCdf(prob);
  const x = mean + z * stdDev;
  return {
    zScore: Number(z.toFixed(4)),
    x: Number(x.toFixed(4))
  };
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface LinearRegressionResult {
  n: number;
  slope: number; // m in y = mx + b
  intercept: number; // b
  correlationR: number; // Pearson r (-1 to 1)
  rSquared: number; // R² (0 to 1)
  standardError: number;
  meanX: number;
  meanY: number;
  sumX: number;
  sumY: number;
  sumXX: number;
  sumYY: number;
  sumXY: number;
  formula: string;
  relationshipStrength: string;
}

/**
 * Computes simple linear regression (ordinary least squares) and Pearson correlation coefficient
 */
export function calculateLinearRegression(points: DataPoint[]): LinearRegressionResult | null {
  const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y));
  const n = validPoints.length;

  if (n < 2) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumYY = 0;
  let sumXY = 0;

  for (const p of validPoints) {
    sumX += p.x;
    sumY += p.y;
    sumXX += p.x * p.x;
    sumYY += p.y * p.y;
    sumXY += p.x * p.y;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const ssXX = sumXX - (sumX * sumX) / n;
  const ssYY = sumYY - (sumY * sumY) / n;
  const ssXY = sumXY - (sumX * sumY) / n;

  if (Math.abs(ssXX) < 1e-12) {
    // Vertical line (undefined slope)
    return {
      n,
      slope: 0,
      intercept: meanY,
      correlationR: 0,
      rSquared: 0,
      standardError: 0,
      meanX,
      meanY,
      sumX,
      sumY,
      sumXX,
      sumYY,
      sumXY,
      formula: `x = ${meanX.toFixed(2)}`,
      relationshipStrength: 'Undefined / Vertical'
    };
  }

  const slope = ssXY / ssXX;
  const intercept = meanY - slope * meanX;

  let r = 0;
  if (ssXX > 0 && ssYY > 0) {
    r = ssXY / Math.sqrt(ssXX * ssYY);
    r = Math.max(-1, Math.min(1, r));
  }

  const rSquared = r * r;

  // Residual sum of squares & standard error
  let ssRes = 0;
  for (const p of validPoints) {
    const yPred = slope * p.x + intercept;
    const diff = p.y - yPred;
    ssRes += diff * diff;
  }
  const standardError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

  let relationshipStrength: string;
  const absR = Math.abs(r);
  if (absR >= 0.9) relationshipStrength = 'Very Strong';
  else if (absR >= 0.7) relationshipStrength = 'Strong';
  else if (absR >= 0.5) relationshipStrength = 'Moderate';
  else if (absR >= 0.3) relationshipStrength = 'Weak';
  else relationshipStrength = 'Very Weak / None';

  const sign = intercept >= 0 ? '+' : '-';
  const absIntercept = Math.abs(intercept);
  const formula = `y = ${slope.toFixed(4)}x ${sign} ${absIntercept.toFixed(4)}`;

  return {
    n,
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    correlationR: Number(r.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    standardError: Number(standardError.toFixed(4)),
    meanX: Number(meanX.toFixed(4)),
    meanY: Number(meanY.toFixed(4)),
    sumX: Number(sumX.toFixed(2)),
    sumY: Number(sumY.toFixed(2)),
    sumXX: Number(sumXX.toFixed(2)),
    sumYY: Number(sumYY.toFixed(2)),
    sumXY: Number(sumXY.toFixed(2)),
    formula,
    relationshipStrength
  };
}
