/**
 * Matrix and Linear Algebra computation utilities
 * Inspired by mathematical libraries for precision matrix computations
 */

export type Matrix = number[][];

export interface MatrixAnalysisResult {
  size: 2 | 3;
  determinant: number;
  isSingular: boolean;
  trace: number;
  rank: number;
  transpose: Matrix;
  inverse: Matrix | null;
  adjugate?: Matrix;
  cofactors?: Matrix;
  steps: string[];
}

export interface MatrixBinaryResult {
  operation: 'add' | 'subtract' | 'multiply';
  result: Matrix;
  steps: string[];
}

/**
 * Validates whether a given 2D array is a valid non-empty rectangle matrix
 */
export function isValidMatrix(m: Matrix): boolean {
  if (!Array.isArray(m) || m.length === 0) return false;
  const cols = m[0].length;
  if (cols === 0) return false;
  return m.every(row => Array.isArray(row) && row.length === cols && row.every(v => typeof v === 'number' && !isNaN(v)));
}

/**
 * Calculates determinant of 2x2 matrix:
 * | a  b |
 * | c  d | = ad - bc
 */
export function det2x2(m: Matrix): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/**
 * Calculates determinant of 3x3 matrix using Laplace expansion along first row:
 * a(ei - fh) - b(di - fg) + c(dh - eg)
 */
export function det3x3(m: Matrix): number {
  const [
    [a, b, c],
    [d, e, f],
    [g, h, i]
  ] = m;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/**
 * Computes transpose of a matrix (rows become columns)
 */
export function transpose(m: Matrix): Matrix {
  const rows = m.length;
  const cols = m[0].length;
  const res: Matrix = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res[c][r] = m[r][c];
    }
  }
  return res;
}

/**
 * Computes trace (sum of main diagonal elements) of a square matrix
 */
export function trace(m: Matrix): number {
  const n = Math.min(m.length, m[0].length);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += m[i][i];
  }
  return sum;
}

/**
 * Computes rank of a matrix using Gaussian elimination with partial pivoting
 */
export function rank(m: Matrix): number {
  const rows = m.length;
  const cols = m[0].length;
  // Clone matrix
  const mat: Matrix = m.map(row => [...row]);
  let r = 0;

  for (let c = 0; c < cols && r < rows; c++) {
    // Find pivot in current column
    let pivotRow = r;
    for (let i = r + 1; i < rows; i++) {
      if (Math.abs(mat[i][c]) > Math.abs(mat[pivotRow][c])) {
        pivotRow = i;
      }
    }

    if (Math.abs(mat[pivotRow][c]) < 1e-9) {
      continue; // No pivot in this column
    }

    // Swap pivot row
    if (pivotRow !== r) {
      const temp = mat[r];
      mat[r] = mat[pivotRow];
      mat[pivotRow] = temp;
    }

    // Eliminate below
    for (let i = r + 1; i < rows; i++) {
      const factor = mat[i][c] / mat[r][c];
      for (let j = c; j < cols; j++) {
        mat[i][j] -= factor * mat[r][j];
      }
    }
    r++;
  }

  return r;
}

/**
 * Inverts a 2x2 matrix:
 * A^-1 = (1 / det) * [ d  -b ]
 *                    [ -c  a ]
 */
export function inverse2x2(m: Matrix): Matrix | null {
  const det = det2x2(m);
  if (Math.abs(det) < 1e-9) return null;
  const invDet = 1 / det;
  return [
    [m[1][1] * invDet, -m[0][1] * invDet],
    [-m[1][0] * invDet, m[0][0] * invDet]
  ];
}

/**
 * Inverts a 3x3 matrix using adjugate formula: A^-1 = adj(A) / det(A)
 */
export function inverse3x3(m: Matrix): Matrix | null {
  const det = det3x3(m);
  if (Math.abs(det) < 1e-9) return null;
  const invDet = 1 / det;

  const [
    [a, b, c],
    [d, e, f],
    [g, h, i]
  ] = m;

  // Cofactor matrix elements
  const c00 = e * i - f * h;
  const c01 = -(d * i - f * g);
  const c02 = d * h - e * g;

  const c10 = -(b * i - c * h);
  const c11 = a * i - c * g;
  const c12 = -(a * h - b * g);

  const c20 = b * f - c * e;
  const c21 = -(a * f - c * d);
  const c22 = a * e - b * d;

  // Adjugate is transpose of cofactor matrix:
  // adj[0][0] = c00, adj[0][1] = c10, adj[0][2] = c20, etc.
  return [
    [c00 * invDet, c10 * invDet, c20 * invDet],
    [c01 * invDet, c11 * invDet, c21 * invDet],
    [c02 * invDet, c12 * invDet, c22 * invDet]
  ];
}

/**
 * Matrix addition: A + B
 */
export function addMatrices(a: Matrix, b: Matrix): MatrixBinaryResult | null {
  if (!isValidMatrix(a) || !isValidMatrix(b)) return null;
  if (a.length !== b.length || a[0].length !== b[0].length) return null;

  const rows = a.length;
  const cols = a[0].length;
  const result: Matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  const steps: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sum = a[r][c] + b[r][c];
      result[r][c] = sum;
      steps.push(`C[${r + 1},${c + 1}] = ${a[r][c]} + ${b[r][c]} = ${sum}`);
    }
  }

  return { operation: 'add', result, steps };
}

/**
 * Matrix subtraction: A - B
 */
export function subtractMatrices(a: Matrix, b: Matrix): MatrixBinaryResult | null {
  if (!isValidMatrix(a) || !isValidMatrix(b)) return null;
  if (a.length !== b.length || a[0].length !== b[0].length) return null;

  const rows = a.length;
  const cols = a[0].length;
  const result: Matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  const steps: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const diff = a[r][c] - b[r][c];
      result[r][c] = diff;
      steps.push(`C[${r + 1},${c + 1}] = ${a[r][c]} - ${b[r][c]} = ${diff}`);
    }
  }

  return { operation: 'subtract', result, steps };
}

/**
 * Matrix multiplication: A × B
 */
export function multiplyMatrices(a: Matrix, b: Matrix): MatrixBinaryResult | null {
  if (!isValidMatrix(a) || !isValidMatrix(b)) return null;
  if (a[0].length !== b.length) return null; // Inner dimensions must match

  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;

  const result: Matrix = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
  const steps: string[] = [];

  for (let r = 0; r < rowsA; r++) {
    for (let c = 0; c < colsB; c++) {
      let sum = 0;
      const terms: string[] = [];
      for (let k = 0; k < colsA; k++) {
        sum += a[r][k] * b[k][c];
        terms.push(`(${a[r][k]} × ${b[k][c]})`);
      }
      result[r][c] = sum;
      steps.push(`C[${r + 1},${c + 1}] = ${terms.join(' + ')} = ${sum}`);
    }
  }

  return { operation: 'multiply', result, steps };
}

/**
 * Comprehensive analysis of a square matrix (2x2 or 3x3)
 */
export function analyzeSquareMatrix(m: Matrix): MatrixAnalysisResult | null {
  if (!isValidMatrix(m)) return null;
  const size = m.length;
  if ((size !== 2 && size !== 3) || m[0].length !== size) return null;

  const steps: string[] = [];
  const trans = transpose(m);
  const tr = trace(m);
  const rk = rank(m);

  let det: number;
  let inv: Matrix | null;
  let cofactors: Matrix | undefined;
  let adjugate: Matrix | undefined;

  if (size === 2) {
    det = det2x2(m);
    steps.push(`Determinant: det(A) = (${m[0][0]} × ${m[1][1]}) - (${m[0][1]} × ${m[1][0]}) = ${det}`);
    inv = inverse2x2(m);
    if (inv) {
      steps.push(`Adjugate: adj(A) = [[${m[1][1]}, ${-m[0][1]}], [${-m[1][0]}, ${m[0][0]}]]`);
      steps.push(`Inverse: A⁻¹ = (1 / ${det}) × adj(A)`);
    } else {
      steps.push('Matrix is singular (det = 0). Inverse does not exist.');
    }
  } else {
    det = det3x3(m);
    const [[a, b, c], [d, e, f], [g, h, i]] = m;
    const t1 = e * i - f * h;
    const t2 = d * i - f * g;
    const t3 = d * h - e * g;
    steps.push(`Laplace expansion on row 1: det(A) = ${a}(${e}×${i} - ${f}×${h}) - ${b}(${d}×${i} - ${f}×${g}) + ${c}(${d}×${h} - ${e}×${g})`);
    steps.push(`det(A) = ${a}(${t1}) - ${b}(${t2}) + ${c}(${t3}) = ${det}`);

    const c00 = e * i - f * h;
    const c01 = -(d * i - f * g);
    const c02 = d * h - e * g;

    const c10 = -(b * i - c * h);
    const c11 = a * i - c * g;
    const c12 = -(a * h - b * g);

    const c20 = b * f - c * e;
    const c21 = -(a * f - c * d);
    const c22 = a * e - b * d;

    cofactors = [
      [c00, c01, c02],
      [c10, c11, c12],
      [c20, c21, c22]
    ];
    adjugate = transpose(cofactors);

    inv = inverse3x3(m);
    if (inv) {
      steps.push(`Calculated 9 cofactors and transposed to obtain Adjugate matrix adj(A).`);
      steps.push(`Inverse: A⁻¹ = adj(A) / det(A).`);
    } else {
      steps.push('Matrix is singular (det = 0). Inverse does not exist.');
    }
  }

  steps.push(`Trace: tr(A) = ${m.map((_, idx) => m[idx][idx]).join(' + ')} = ${tr}`);
  steps.push(`Rank: rank(A) = ${rk} (Linearly independent row vectors)`);

  return {
    size: size as 2 | 3,
    determinant: det,
    isSingular: Math.abs(det) < 1e-9,
    trace: tr,
    rank: rk,
    transpose: trans,
    inverse: inv,
    adjugate,
    cofactors,
    steps
  };
}
