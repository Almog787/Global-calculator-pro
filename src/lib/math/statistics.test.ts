import { describe, it, expect } from 'vitest';
import {
  standardNormalCdf,
  calculateZScore,
  calculateInverseZScore,
  calculateLinearRegression
} from './statistics';

describe('Statistics Utilities', () => {
  describe('Z-Score & Normal Distribution', () => {
    it('standardNormalCdf(0) should be 0.5', () => {
      expect(standardNormalCdf(0)).toBeCloseTo(0.5, 4);
    });

    it('standardNormalCdf(1.96) should be approx 0.975', () => {
      expect(standardNormalCdf(1.96)).toBeCloseTo(0.975, 3);
    });

    it('calculates Z-score correctly for standard parameters', () => {
      // x = 115, mean = 100, sd = 15 -> z = 1.0
      const res = calculateZScore(115, 100, 15);
      expect(res.zScore).toBe(1);
      expect(res.probabilityLess).toBeCloseTo(0.84134, 4);
      expect(res.percentile).toBeCloseTo(84.13, 1);
    });

    it('calculates inverse Z-score correctly', () => {
      const inv = calculateInverseZScore(0.84134, 100, 15);
      expect(inv.zScore).toBeCloseTo(1, 1);
      expect(inv.x).toBeCloseTo(115, 0);
    });
  });

  describe('Linear Regression', () => {
    it('fits a perfect linear dataset y = 2x + 1', () => {
      const points = [
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 },
        { x: 4, y: 9 },
        { x: 5, y: 11 }
      ];
      const res = calculateLinearRegression(points);
      expect(res).not.toBeNull();
      expect(res?.slope).toBe(2);
      expect(res?.intercept).toBe(1);
      expect(res?.correlationR).toBe(1);
      expect(res?.rSquared).toBe(1);
    });

    it('handles negative correlation correctly', () => {
      const points = [
        { x: 1, y: 10 },
        { x: 2, y: 8 },
        { x: 3, y: 6 },
        { x: 4, y: 4 }
      ];
      const res = calculateLinearRegression(points);
      expect(res).not.toBeNull();
      expect(res?.slope).toBe(-2);
      expect(res?.intercept).toBe(12);
      expect(res?.correlationR).toBe(-1);
    });
  });
});
