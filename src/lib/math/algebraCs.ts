/**
 * Algebra & Equations Math Utilities
 * Covers Quadratic Equations, Linear Systems (2x2 and 3x3),
 * Base Conversions, and Bitwise Arithmetic.
 */

// --- TASK 2: ALGEBRA & EQUATIONS ---

export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number; // Δ = b² - 4ac
  natureOfRoots: 'two_real' | 'one_real' | 'complex';
  root1: { real: number; imag: number; text: string };
  root2: { real: number; imag: number; text: string };
  vertex: { x: number; y: number }; // Parabola apex (-b/2a, c - b²/4a)
  axisOfSymmetry: number;
  yIntercept: number;
  opensDirection: 'up' | 'down';
  factoredForm?: string;
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult | null {
  if (a === 0) {
    return null; // Degenerate: not a quadratic equation (linear: bx + c = 0)
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);
  const axisOfSymmetry = vertexX;
  const yIntercept = c;
  const opensDirection = a > 0 ? 'up' : 'down';

  const steps: string[] = [
    `Standard Form: ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`,
    `Identify coefficients: a = ${a}, b = ${b}, c = ${c}`,
    `Calculate Discriminant (Δ = b² - 4ac): (${b})² - 4(${a})(${c}) = ${discriminant}`
  ];

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);

    steps.push(
      `Δ > 0: Two distinct real roots.`,
      `x = (-b ± √Δ) / 2a = (-(${b}) ± √${discriminant}) / (2 × ${a})`,
      `x₁ = (${-b} + ${sqrtD.toFixed(4)}) / ${2 * a} = ${r1.toFixed(4)}`,
      `x₂ = (${-b} - ${sqrtD.toFixed(4)}) / ${2 * a} = ${r2.toFixed(4)}`
    );

    return {
      a,
      b,
      c,
      discriminant,
      natureOfRoots: 'two_real',
      root1: { real: Number(r1.toFixed(4)), imag: 0, text: r1.toFixed(4) },
      root2: { real: Number(r2.toFixed(4)), imag: 0, text: r2.toFixed(4) },
      vertex: { x: Number(vertexX.toFixed(4)), y: Number(vertexY.toFixed(4)) },
      axisOfSymmetry: Number(axisOfSymmetry.toFixed(4)),
      yIntercept,
      opensDirection,
      factoredForm: a === 1 ? `(x - ${r1.toFixed(2)})(x - ${r2.toFixed(2)})` : `${a}(x - ${r1.toFixed(2)})(x - ${r2.toFixed(2)})`,
      steps
    };
  } else if (discriminant === 0) {
    const r = -b / (2 * a);
    steps.push(
      `Δ = 0: One repeated real root (double root).`,
      `x = -b / 2a = -(${b}) / (2 × ${a}) = ${r.toFixed(4)}`
    );

    return {
      a,
      b,
      c,
      discriminant: 0,
      natureOfRoots: 'one_real',
      root1: { real: Number(r.toFixed(4)), imag: 0, text: r.toFixed(4) },
      root2: { real: Number(r.toFixed(4)), imag: 0, text: r.toFixed(4) },
      vertex: { x: Number(vertexX.toFixed(4)), y: Number(vertexY.toFixed(4)) },
      axisOfSymmetry: Number(axisOfSymmetry.toFixed(4)),
      yIntercept,
      opensDirection,
      factoredForm: a === 1 ? `(x - ${r.toFixed(2)})²` : `${a}(x - ${r.toFixed(2)})²`,
      steps
    };
  } else {
    // Complex roots
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
    const absImag = Math.abs(imagPart);

    steps.push(
      `Δ < 0: Two complex conjugate roots.`,
      `x = (-b ± i√|Δ|) / 2a = (-(${b}) ± i√${Math.abs(discriminant)}) / (2 × ${a})`,
      `x₁ = ${realPart.toFixed(4)} + ${absImag.toFixed(4)}i`,
      `x₂ = ${realPart.toFixed(4)} - ${absImag.toFixed(4)}i`
    );

    return {
      a,
      b,
      c,
      discriminant,
      natureOfRoots: 'complex',
      root1: { real: Number(realPart.toFixed(4)), imag: Number(absImag.toFixed(4)), text: `${realPart.toFixed(4)} + ${absImag.toFixed(4)}i` },
      root2: { real: Number(realPart.toFixed(4)), imag: -Number(absImag.toFixed(4)), text: `${realPart.toFixed(4)} - ${absImag.toFixed(4)}i` },
      vertex: { x: Number(vertexX.toFixed(4)), y: Number(vertexY.toFixed(4)) },
      axisOfSymmetry: Number(axisOfSymmetry.toFixed(4)),
      yIntercept,
      opensDirection,
      steps
    };
  }
}

export interface LinearSystem2x2Result {
  determinantD: number;
  determinantDx: number;
  determinantDy: number;
  solutionType: 'unique' | 'infinite' | 'inconsistent';
  x?: number;
  y?: number;
  steps: string[];
}

/**
 * Solves 2x2 system:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 * using Cramer's Rule
 */
export function solveSystem2x2(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): LinearSystem2x2Result {
  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  const steps = [
    `Equation 1: ${a1}x + ${b1}y = ${c1}`,
    `Equation 2: ${a2}x + ${b2}y = ${c2}`,
    `Determinant D = (${a1} × ${b2}) - (${a2} × ${b1}) = ${D}`,
    `Determinant Dx = (${c1} × ${b2}) - (${c2} × ${b1}) = ${Dx}`,
    `Determinant Dy = (${a1} × ${c2}) - (${a2} × ${c1}) = ${Dy}`
  ];

  if (Math.abs(D) > 1e-10) {
    const x = Dx / D;
    const y = Dy / D;
    steps.push(
      `D ≠ 0: Unique solution exists.`,
      `x = Dx / D = ${Dx} / ${D} = ${x.toFixed(4)}`,
      `y = Dy / D = ${Dy} / ${D} = ${y.toFixed(4)}`
    );
    return {
      determinantD: D,
      determinantDx: Dx,
      determinantDy: Dy,
      solutionType: 'unique',
      x: Number(x.toFixed(4)),
      y: Number(y.toFixed(4)),
      steps
    };
  } else {
    if (Math.abs(Dx) < 1e-10 && Math.abs(Dy) < 1e-10) {
      steps.push(`D = 0 and Dx = Dy = 0: Infinitely many solutions (dependent lines).`);
      return {
        determinantD: D,
        determinantDx: Dx,
        determinantDy: Dy,
        solutionType: 'infinite',
        steps
      };
    } else {
      steps.push(`D = 0 but Dx or Dy ≠ 0: No solution exists (parallel lines / inconsistent system).`);
      return {
        determinantD: D,
        determinantDx: Dx,
        determinantDy: Dy,
        solutionType: 'inconsistent',
        steps
      };
    }
  }
}


// --- TASK 3: COMPUTER SCIENCE & NUMBER SYSTEMS ---

export interface BaseConversionResult {
  decimal: number;
  binary: string;
  octal: string;
  hexadecimal: string;
  customBaseValue?: string;
  steps: string[];
}

export function convertNumberBase(
  inputValue: string,
  fromBase: number,
  targetCustomBase?: number
): BaseConversionResult | null {
  const cleanStr = inputValue.trim();
  if (!cleanStr) return null;

  try {
    const dec = parseInt(cleanStr, fromBase);
    if (isNaN(dec) || !isFinite(dec)) return null;

    const binary = dec.toString(2);
    const octal = dec.toString(8);
    const hex = dec.toString(16).toUpperCase();
    const custom = targetCustomBase ? dec.toString(targetCustomBase).toUpperCase() : undefined;

    const steps: string[] = [
      `Source value: "${cleanStr}" in Base ${fromBase}`,
      `Converted to Decimal (Base 10): ${dec}`,
      `Binary (Base 2): ${binary}`,
      `Octal (Base 8): ${octal}`,
      `Hexadecimal (Base 16): 0x${hex}`
    ];

    if (targetCustomBase && custom) {
      steps.push(`Custom Base ${targetCustomBase}: ${custom}`);
    }

    return {
      decimal: dec,
      binary,
      octal,
      hexadecimal: hex,
      customBaseValue: custom,
      steps
    };
  } catch {
    return null;
  }
}

export interface BitwiseResult {
  a: number;
  b: number;
  bitLength: 8 | 16 | 32;
  and: number;
  or: number;
  xor: number;
  notA: number;
  notB: number;
  shiftLeftA: number;
  shiftRightA: number;
  binaryA: string;
  binaryB: string;
  binaryAnd: string;
  binaryOr: string;
  binaryXor: string;
  binaryNotA: string;
}

export function calculateBitwise(a: number, b: number, bitLength: 8 | 16 | 32 = 8): BitwiseResult {
  const mask = bitLength === 8 ? 0xFF : bitLength === 16 ? 0xFFFF : 0xFFFFFFFF;

  const resAnd = (a & b) & mask;
  const resOr = (a | b) & mask;
  const resXor = (a ^ b) & mask;
  const resNotA = (~a) & mask;
  const resNotB = (~b) & mask;
  const shiftLeftA = (a << 1) & mask;
  const shiftRightA = (a >> 1) & mask;

  const toBin = (val: number) => {
    const positiveVal = val >>> 0;
    return (positiveVal & mask).toString(2).padStart(bitLength, '0');
  };

  return {
    a,
    b,
    bitLength,
    and: resAnd,
    or: resOr,
    xor: resXor,
    notA: resNotA,
    notB: resNotB,
    shiftLeftA,
    shiftRightA,
    binaryA: toBin(a),
    binaryB: toBin(b),
    binaryAnd: toBin(resAnd),
    binaryOr: toBin(resOr),
    binaryXor: toBin(resXor),
    binaryNotA: toBin(resNotA)
  };
}
