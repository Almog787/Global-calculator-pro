import { describe, it, expect } from 'vitest';
import {
  solveQuadratic,
  solveSystem2x2,
  convertNumberBase,
  calculateBitwise
} from './algebraCs';

describe('Algebra & Computer Science Utilities', () => {
  describe('Quadratic Equation Solver', () => {
    it('solves x² - 5x + 6 = 0 (two distinct real roots: 3, 2)', () => {
      const res = solveQuadratic(1, -5, 6);
      expect(res).not.toBeNull();
      expect(res?.discriminant).toBe(1);
      expect(res?.natureOfRoots).toBe('two_real');
      expect([res?.root1.real, res?.root2.real].sort()).toEqual([2, 3]);
      expect(res?.vertex.x).toBe(2.5);
      expect(res?.vertex.y).toBe(-0.25);
    });

    it('solves x² - 4x + 4 = 0 (one real repeated root: 2)', () => {
      const res = solveQuadratic(1, -4, 4);
      expect(res).not.toBeNull();
      expect(res?.discriminant).toBe(0);
      expect(res?.natureOfRoots).toBe('one_real');
      expect(res?.root1.real).toBe(2);
      expect(res?.root2.real).toBe(2);
    });

    it('solves x² + 1 = 0 (complex roots: +i, -i)', () => {
      const res = solveQuadratic(1, 0, 1);
      expect(res).not.toBeNull();
      expect(res?.discriminant).toBe(-4);
      expect(res?.natureOfRoots).toBe('complex');
      expect(res?.root1.imag).toBe(1);
      expect(res?.root2.imag).toBe(-1);
    });
  });

  describe('2x2 Linear System Solver', () => {
    it('solves standard 2x2 system with unique solution', () => {
      // 2x + y = 5
      // x - y = 1
      // -> x = 2, y = 1
      const res = solveSystem2x2(2, 1, 5, 1, -1, 1);
      expect(res.solutionType).toBe('unique');
      expect(res.x).toBe(2);
      expect(res.y).toBe(1);
    });

    it('identifies inconsistent parallel lines', () => {
      // 2x + 2y = 4
      // 2x + 2y = 8
      const res = solveSystem2x2(2, 2, 4, 2, 2, 8);
      expect(res.solutionType).toBe('inconsistent');
    });
  });

  describe('Base Converter & Bitwise Operations', () => {
    it('converts decimal 255 to hex FF, binary 11111111, octal 377', () => {
      const res = convertNumberBase('255', 10);
      expect(res).not.toBeNull();
      expect(res?.hexadecimal).toBe('FF');
      expect(res?.binary).toBe('11111111');
      expect(res?.octal).toBe('377');
    });

    it('performs bitwise AND, OR, XOR accurately on 8-bit integers', () => {
      const res = calculateBitwise(12, 10, 8); // 12=1100, 10=1010
      expect(res.and).toBe(8); // 1000
      expect(res.or).toBe(14); // 1110
      expect(res.xor).toBe(6); // 0110
    });
  });
});
