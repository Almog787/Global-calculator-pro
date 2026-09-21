/**
 * Complex Numbers mathematics engine
 * Inspired by complex logic algorithms for polar/Euler representations and arithmetic
 */

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface ComplexPolar {
  r: number;
  thetaRad: number;
  thetaDeg: number;
  polarString: string;
  eulerString: string;
}

export interface ComplexOperationResult {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'power';
  result: ComplexNumber;
  formatted: string;
  polar: ComplexPolar;
  conjugate: ComplexNumber;
  steps: string[];
}

export interface ComplexAnalysis {
  z: ComplexNumber;
  formatted: string;
  conjugate: ComplexNumber;
  modulus: number;
  argumentRad: number;
  argumentDeg: number;
  polarForm: string;
  eulerForm: string;
  reciprocal: ComplexNumber | null;
  squareRootPrimary: ComplexNumber;
  squareRootSecondary: ComplexNumber;
  steps: string[];
}

/**
 * Formats a complex number nicely: e.g. "3 + 4i", "5 - 2i", "4i", "-7", "0"
 */
export function formatComplex(z: ComplexNumber, precision = 4): string {
  const re = Number(z.re.toFixed(precision));
  const im = Number(z.im.toFixed(precision));

  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }

  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? 'i' : `${absIm}i`;
  return `${re} ${sign} ${imStr}`;
}

/**
 * Calculates modulus (absolute value): |z| = sqrt(a² + b²)
 */
export function modulus(z: ComplexNumber): number {
  return Math.hypot(z.re, z.im);
}

/**
 * Calculates argument (angle): θ = atan2(b, a) in radians and degrees
 */
export function argument(z: ComplexNumber): { rad: number; deg: number } {
  const rad = Math.atan2(z.im, z.re);
  const deg = (rad * 180) / Math.PI;
  return { rad, deg };
}

/**
 * Calculates complex conjugate: conjugate(a + bi) = a - bi
 */
export function conjugate(z: ComplexNumber): ComplexNumber {
  return { re: z.re, im: -z.im };
}

/**
 * Converts complex number to Polar and Euler form
 */
export function toPolar(z: ComplexNumber): ComplexPolar {
  const r = modulus(z);
  const { rad, deg } = argument(z);
  const rFormatted = Number(r.toFixed(4));
  const degFormatted = Number(deg.toFixed(2));
  const radFormatted = Number(rad.toFixed(4));

  return {
    r,
    thetaRad: rad,
    thetaDeg: deg,
    polarString: `${rFormatted} · (cos(${degFormatted}°) + i·sin(${degFormatted}°))`,
    eulerString: `${rFormatted} · e^(${radFormatted}i)`
  };
}

/**
 * Complex Addition: (a + bi) + (c + di) = (a + c) + (b + d)i
 */
export function addComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexOperationResult {
  const re = z1.re + z2.re;
  const im = z1.im + z2.im;
  const result = { re, im };
  const polar = toPolar(result);
  const steps = [
    `Re(z) = Re(z₁) + Re(z₂) = ${z1.re} + ${z2.re} = ${re}`,
    `Im(z) = Im(z₁) + Im(z₂) = ${z1.im} + ${z2.im} = ${im}`,
    `Result = ${formatComplex(result)}`
  ];

  return {
    operation: 'add',
    result,
    formatted: formatComplex(result),
    polar,
    conjugate: conjugate(result),
    steps
  };
}

/**
 * Complex Subtraction: (a + bi) - (c + di) = (a - c) + (b - d)i
 */
export function subComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexOperationResult {
  const re = z1.re - z2.re;
  const im = z1.im - z2.im;
  const result = { re, im };
  const polar = toPolar(result);
  const steps = [
    `Re(z) = Re(z₁) - Re(z₂) = ${z1.re} - (${z2.re}) = ${re}`,
    `Im(z) = Im(z₁) - Im(z₂) = ${z1.im} - (${z2.im}) = ${im}`,
    `Result = ${formatComplex(result)}`
  ];

  return {
    operation: 'subtract',
    result,
    formatted: formatComplex(result),
    polar,
    conjugate: conjugate(result),
    steps
  };
}

/**
 * Complex Multiplication: (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 */
export function mulComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexOperationResult {
  const re = z1.re * z2.re - z1.im * z2.im;
  const im = z1.re * z2.im + z1.im * z2.re;
  const result = { re, im };
  const polar = toPolar(result);
  const steps = [
    `Expand: (${formatComplex(z1)}) × (${formatComplex(z2)}) = (${z1.re}·${z2.re}) + (${z1.re}·${z2.im}i) + (${z1.im}i·${z2.re}) + (${z1.im}·${z2.im}i²)`,
    `Using i² = -1: (${z1.re * z2.re} - ${z1.im * z2.im}) + (${z1.re * z2.im} + ${z1.im * z2.re})i`,
    `Result = ${formatComplex(result)}`
  ];

  return {
    operation: 'multiply',
    result,
    formatted: formatComplex(result),
    polar,
    conjugate: conjugate(result),
    steps
  };
}

/**
 * Complex Division: (a + bi)/(c + di) = [(a + bi)(c - di)] / (c² + d²)
 */
export function divComplex(z1: ComplexNumber, z2: ComplexNumber): ComplexOperationResult | null {
  const denom = z2.re * z2.re + z2.im * z2.im;
  if (denom === 0) return null;

  const re = (z1.re * z2.re + z1.im * z2.im) / denom;
  const im = (z1.im * z2.re - z1.re * z2.im) / denom;
  const result = { re, im };
  const polar = toPolar(result);
  const steps = [
    `Multiply numerator & denominator by conjugate of denominator (${formatComplex(conjugate(z2))}):`,
    `Denominator = |z₂|² = ${z2.re}² + ${z2.im}² = ${denom}`,
    `Numerator Re = (${z1.re}·${z2.re} + ${z1.im}·${z2.im}) = ${z1.re * z2.re + z1.im * z2.im}`,
    `Numerator Im = (${z1.im}·${z2.re} - ${z1.re}·${z2.im}) = ${z1.im * z2.re - z1.re * z2.im}`,
    `Result = ${formatComplex(result)}`
  ];

  return {
    operation: 'divide',
    result,
    formatted: formatComplex(result),
    polar,
    conjugate: conjugate(result),
    steps
  };
}

/**
 * Powers using De Moivre's Theorem: z^n = r^n · (cos(nθ) + i·sin(nθ))
 */
export function powerComplex(z: ComplexNumber, n: number): ComplexOperationResult {
  const r = modulus(z);
  const { rad } = argument(z);
  const rPow = Math.pow(r, n);
  const angle = n * rad;

  const re = rPow * Math.cos(angle);
  const im = rPow * Math.sin(angle);
  const result = { re, im };
  const polar = toPolar(result);
  const steps = [
    `Modulus r = |${formatComplex(z)}| = ${r.toFixed(4)}, Argument θ = ${(rad * 180 / Math.PI).toFixed(2)}°`,
    `By De Moivre's Theorem: z^${n} = r^${n} · [cos(${n}·θ) + i·sin(${n}·θ)]`,
    `r^${n} = ${rPow.toFixed(4)}, new angle = ${(angle * 180 / Math.PI).toFixed(2)}°`,
    `Result = ${formatComplex(result)}`
  ];

  return {
    operation: 'power',
    result,
    formatted: formatComplex(result),
    polar,
    conjugate: conjugate(result),
    steps
  };
}

/**
 * Full analysis of a single complex number
 */
export function analyzeComplex(z: ComplexNumber): ComplexAnalysis {
  const mod = modulus(z);
  const { rad, deg } = argument(z);
  const conj = conjugate(z);
  const polar = toPolar(z);

  // Reciprocal: 1/z = conj(z) / |z|²
  let recip: ComplexNumber | null = null;
  if (mod !== 0) {
    const d = mod * mod;
    recip = { re: conj.re / d, im: conj.im / d };
  }

  // Square roots using polar half-angle
  const sqrtR = Math.sqrt(mod);
  const halfAngle = rad / 2;
  const primarySqrt: ComplexNumber = {
    re: sqrtR * Math.cos(halfAngle),
    im: sqrtR * Math.sin(halfAngle)
  };
  const secondarySqrt: ComplexNumber = {
    re: -primarySqrt.re,
    im: -primarySqrt.im
  };

  const steps = [
    `Algebraic Form: z = ${formatComplex(z)}`,
    `Modulus (Absolute Value): |z| = √(${z.re}² + ${z.im}²) = ${mod.toFixed(4)}`,
    `Argument (Phase): θ = atan2(${z.im}, ${z.re}) = ${deg.toFixed(2)}° (${rad.toFixed(4)} rad)`,
    `Polar Representation: z = ${polar.polarString}`,
    `Euler Exponential Form: z = ${polar.eulerString}`,
    `Complex Conjugate: z̄ = ${formatComplex(conj)}`
  ];

  return {
    z,
    formatted: formatComplex(z),
    conjugate: conj,
    modulus: mod,
    argumentRad: rad,
    argumentDeg: deg,
    polarForm: polar.polarString,
    eulerForm: polar.eulerString,
    reciprocal: recip,
    squareRootPrimary: primarySqrt,
    squareRootSecondary: secondarySqrt,
    steps
  };
}
