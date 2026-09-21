import { describe, it, expect } from 'vitest';
import {
  formatComplex,
  modulus,
  argument,
  conjugate,
  addComplex,
  subComplex,
  mulComplex,
  divComplex,
  powerComplex,
  analyzeComplex
} from './complex';

describe('Complex numbers mathematics engine', () => {
  it('should format complex numbers cleanly', () => {
    expect(formatComplex({ re: 3, im: 4 })).toBe('3 + 4i');
    expect(formatComplex({ re: 2, im: -5 })).toBe('2 - 5i');
    expect(formatComplex({ re: 0, im: 1 })).toBe('i');
    expect(formatComplex({ re: 0, im: -1 })).toBe('-i');
    expect(formatComplex({ re: 7, im: 0 })).toBe('7');
  });

  it('should calculate modulus accurately', () => {
    expect(modulus({ re: 3, im: 4 })).toBe(5);
    expect(modulus({ re: 1, im: 1 })).toBeCloseTo(Math.SQRT2);
  });

  it('should calculate argument in degrees and radians', () => {
    const { deg } = argument({ re: 0, im: 5 });
    expect(deg).toBeCloseTo(90);

    const { deg: deg180 } = argument({ re: -5, im: 0 });
    expect(deg180).toBeCloseTo(180);
  });

  it('should calculate conjugate', () => {
    expect(conjugate({ re: 4, im: 7 })).toEqual({ re: 4, im: -7 });
    expect(conjugate({ re: -2, im: -3 })).toEqual({ re: -2, im: 3 });
  });

  it('should perform complex addition and subtraction', () => {
    const z1 = { re: 2, im: 3 };
    const z2 = { re: 4, im: -1 };

    const sum = addComplex(z1, z2);
    expect(sum.result).toEqual({ re: 6, im: 2 });

    const diff = subComplex(z1, z2);
    expect(diff.result).toEqual({ re: -2, im: 4 });
  });

  it('should perform complex multiplication', () => {
    // (1 + 2i) * (3 + 4i) = (3 - 8) + (4 + 6)i = -5 + 10i
    const z1 = { re: 1, im: 2 };
    const z2 = { re: 3, im: 4 };
    const prod = mulComplex(z1, z2);
    expect(prod.result).toEqual({ re: -5, im: 10 });
  });

  it('should perform complex division', () => {
    // (4 + 2i) / (3 - i) = [(4+2i)(3+i)] / 10 = (12 - 2 + 6i + 4i)/10 = (10 + 10i)/10 = 1 + i
    const z1 = { re: 4, im: 2 };
    const z2 = { re: 3, im: -1 };
    const div = divComplex(z1, z2);
    expect(div).not.toBeNull();
    expect(div!.result.re).toBeCloseTo(1);
    expect(div!.result.im).toBeCloseTo(1);
  });

  it('should return null when dividing by zero', () => {
    const div = divComplex({ re: 5, im: 3 }, { re: 0, im: 0 });
    expect(div).toBeNull();
  });

  it('should compute powers via De Moivre theorem', () => {
    // (1 + i)^2 = 1 + 2i - 1 = 2i
    const z = { re: 1, im: 1 };
    const p = powerComplex(z, 2);
    expect(p.result.re).toBeCloseTo(0);
    expect(p.result.im).toBeCloseTo(2);
  });

  it('should analyze complex number thoroughly', () => {
    const analysis = analyzeComplex({ re: 3, im: 4 });
    expect(analysis.modulus).toBe(5);
    expect(analysis.argumentDeg).toBeCloseTo(53.13, 1);
    expect(analysis.reciprocal).not.toBeNull();
    expect(analysis.reciprocal!.re).toBeCloseTo(3 / 25);
    expect(analysis.reciprocal!.im).toBeCloseTo(-4 / 25);
  });
});
