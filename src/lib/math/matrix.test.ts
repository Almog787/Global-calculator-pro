import { describe, it, expect } from 'vitest';
import {
  det2x2,
  det3x3,
  transpose,
  trace,
  rank,
  inverse2x2,
  inverse3x3,
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  analyzeSquareMatrix
} from './matrix';

describe('Matrix and Linear Algebra computations', () => {
  it('should calculate 2x2 determinant correctly', () => {
    const m = [
      [3, 8],
      [4, 6]
    ];
    // 3*6 - 8*4 = 18 - 32 = -14
    expect(det2x2(m)).toBe(-14);
  });

  it('should calculate 3x3 determinant correctly', () => {
    const m = [
      [6, 1, 1],
      [4, -2, 5],
      [2, 8, 7]
    ];
    // 6*(-14 - 40) - 1*(28 - 10) + 1*(32 - (-4))
    // 6*(-54) - 1*(18) + 1*(36) = -324 - 18 + 36 = -306
    expect(det3x3(m)).toBe(-306);
  });

  it('should compute transpose correctly', () => {
    const m = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    expect(transpose(m)).toEqual([
      [1, 4],
      [2, 5],
      [3, 6]
    ]);
  });

  it('should compute trace of matrix', () => {
    const m = [
      [2, 5, 1],
      [0, 7, 9],
      [3, 4, -1]
    ];
    expect(trace(m)).toBe(2 + 7 + -1);
  });

  it('should compute rank accurately', () => {
    const fullRank = [
      [1, 0],
      [0, 1]
    ];
    expect(rank(fullRank)).toBe(2);

    const rankOne = [
      [1, 2],
      [2, 4]
    ];
    expect(rank(rankOne)).toBe(1);

    const zeroMat = [
      [0, 0],
      [0, 0]
    ];
    expect(rank(zeroMat)).toBe(0);
  });

  it('should calculate inverse of 2x2 matrix', () => {
    const m = [
      [4, 7],
      [2, 6]
    ];
    // det = 4*6 - 7*2 = 24 - 14 = 10
    // inv = 1/10 * [[6, -7], [-2, 4]] = [[0.6, -0.7], [-0.2, 0.4]]
    const inv = inverse2x2(m);
    expect(inv).not.toBeNull();
    expect(inv![0][0]).toBeCloseTo(0.6);
    expect(inv![0][1]).toBeCloseTo(-0.7);
    expect(inv![1][0]).toBeCloseTo(-0.2);
    expect(inv![1][1]).toBeCloseTo(0.4);
  });

  it('should return null for inverse of singular 2x2 matrix', () => {
    const singular = [
      [2, 4],
      [1, 2]
    ];
    expect(inverse2x2(singular)).toBeNull();
  });

  it('should calculate inverse of 3x3 matrix and verify A * A^-1 = I', () => {
    const m = [
      [1, 2, 3],
      [0, 1, 4],
      [5, 6, 0]
    ];
    const inv = inverse3x3(m);
    expect(inv).not.toBeNull();
    const prod = multiplyMatrices(m, inv!);
    expect(prod).not.toBeNull();
    // Verify identity matrix
    expect(prod!.result[0][0]).toBeCloseTo(1);
    expect(prod!.result[0][1]).toBeCloseTo(0);
    expect(prod!.result[0][2]).toBeCloseTo(0);
    expect(prod!.result[1][1]).toBeCloseTo(1);
    expect(prod!.result[2][2]).toBeCloseTo(1);
  });

  it('should add and subtract matrices', () => {
    const a = [
      [1, 2],
      [3, 4]
    ];
    const b = [
      [5, 6],
      [7, 8]
    ];
    const added = addMatrices(a, b);
    expect(added?.result).toEqual([
      [6, 8],
      [10, 12]
    ]);

    const subtracted = subtractMatrices(b, a);
    expect(subtracted?.result).toEqual([
      [4, 4],
      [4, 4]
    ]);
  });

  it('should perform full analysis of square matrix', () => {
    const m = [
      [1, 2],
      [3, 4]
    ];
    const res = analyzeSquareMatrix(m);
    expect(res).not.toBeNull();
    expect(res?.determinant).toBe(-2);
    expect(res?.trace).toBe(5);
    expect(res?.rank).toBe(2);
    expect(res?.isSingular).toBe(false);
  });
});
