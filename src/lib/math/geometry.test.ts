import { describe, it, expect } from 'vitest';
import { solveTriangleSSS, solveTriangleSAS, calculateCircleSector } from './geometry';

describe('Geometry & Trigonometry Utilities Suite', () => {
  describe('solveTriangleSSS', () => {
    it('should solve a 3-4-5 right triangle accurately', () => {
      const res = solveTriangleSSS(3, 4, 5);
      expect(res).not.toBeNull();
      expect(res?.area).toBeCloseTo(6, 2);
      expect(res?.perimeter).toBe(12);
      expect(res?.angleC).toBeCloseTo(90, 1);
      expect(res?.triangleType.byAngles).toBe('right');
      expect(res?.triangleType.bySides).toBe('scalene');
      expect(res?.inradius).toBeCloseTo(1, 2);
      expect(res?.circumradius).toBeCloseTo(2.5, 2);
    });

    it('should identify an equilateral triangle', () => {
      const res = solveTriangleSSS(6, 6, 6);
      expect(res).not.toBeNull();
      expect(res?.triangleType.bySides).toBe('equilateral');
      expect(res?.angleA).toBeCloseTo(60, 1);
      expect(res?.angleB).toBeCloseTo(60, 1);
      expect(res?.angleC).toBeCloseTo(60, 1);
    });

    it('should reject invalid triangle inequalities', () => {
      expect(solveTriangleSSS(1, 2, 10)).toBeNull();
      expect(solveTriangleSSS(5, 5, 10)).toBeNull(); // collinear degenerate
      expect(solveTriangleSSS(-3, 4, 5)).toBeNull();
    });
  });

  describe('solveTriangleSAS', () => {
    it('should solve triangle with 2 sides and 90 deg included angle', () => {
      const res = solveTriangleSAS(3, 4, 90);
      expect(res).not.toBeNull();
      expect(res?.sideC).toBeCloseTo(5, 2);
      expect(res?.area).toBeCloseTo(6, 2);
    });

    it('should reject non-positive sides or invalid angles', () => {
      expect(solveTriangleSAS(0, 5, 45)).toBeNull();
      expect(solveTriangleSAS(5, 5, 180)).toBeNull();
      expect(solveTriangleSAS(5, 5, -10)).toBeNull();
    });
  });

  describe('calculateCircleSector', () => {
    it('should calculate quarter circle sector (90 deg) accurately', () => {
      const r = 10;
      const res = calculateCircleSector(r, 90);
      expect(res).not.toBeNull();
      // s = r * (π/2) = 5π ≈ 15.708
      expect(res?.arcLength).toBeCloseTo(15.708, 2);
      // Area = 0.25 * π * 100 = 25π ≈ 78.5398
      expect(res?.sectorArea).toBeCloseTo(78.5398, 2);
      // Chord = 10 * √2 ≈ 14.142
      expect(res?.chordLength).toBeCloseTo(14.142, 2);
    });

    it('should return null for invalid inputs', () => {
      expect(calculateCircleSector(-5, 90)).toBeNull();
      expect(calculateCircleSector(10, 0)).toBeNull();
      expect(calculateCircleSector(10, 400)).toBeNull();
    });
  });
});
