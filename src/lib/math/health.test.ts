import { describe, it, expect } from 'vitest';
import { calculateBmi, calculateBmr } from './health';

describe('Health Math Engine', () => {
  describe('calculateBmi', () => {
    it('should calculate BMI correctly for standard values', () => {
      // 70kg, 175cm -> 70 / (1.75^2) = 22.857 -> 22.9
      const result = calculateBmi(70, 175);
      expect(result.bmi).toBe(22.9);
      expect(result.status).toBe('normal');
      expect(result.color).toBe('green');
    });

    it('should classify underweight properly', () => {
      const result = calculateBmi(45, 170);
      expect(result.bmi).toBe(15.6);
      expect(result.status).toBe('underweight');
      expect(result.color).toBe('blue');
    });

    it('should classify overweight properly', () => {
      const result = calculateBmi(85, 175);
      expect(result.bmi).toBe(27.8);
      expect(result.status).toBe('overweight');
      expect(result.color).toBe('yellow');
    });

    it('should classify obese properly', () => {
      const result = calculateBmi(110, 175);
      expect(result.bmi).toBe(35.9);
      expect(result.status).toBe('obese');
      expect(result.color).toBe('red');
    });

    it('should return safe fallback on zero or negative values', () => {
      expect(calculateBmi(0, 175)).toEqual({ bmi: 0, status: 'normal', color: 'gray' });
      expect(calculateBmi(70, -10)).toEqual({ bmi: 0, status: 'normal', color: 'gray' });
    });
  });

  describe('calculateBmr', () => {
    it('should calculate Mifflin-St Jeor equation for males', () => {
      // male: 70kg, 175cm, 30 yrs -> 10*70 + 6.25*175 - 5*30 + 5 = 1648.75 -> 1649
      const result = calculateBmr(70, 175, 30, 'male', 'mifflin');
      expect(result.bmr).toBe(1649);
      expect(result.tdee.sedentary).toBe(Math.round(1649 * 1.2));
      expect(result.tdee.moderate).toBe(Math.round(1649 * 1.55));
    });

    it('should calculate Mifflin-St Jeor equation for females', () => {
      // female: 60kg, 165cm, 25 yrs -> 10*60 + 6.25*165 - 5*25 - 161 = 1345.25 -> 1345
      const result = calculateBmr(60, 165, 25, 'female', 'mifflin');
      expect(result.bmr).toBe(1345);
    });

    it('should calculate Harris-Benedict equation properly', () => {
      const maleResult = calculateBmr(70, 175, 30, 'male', 'harris');
      expect(maleResult.bmr).toBeGreaterThan(1500);

      const femaleResult = calculateBmr(60, 165, 25, 'female', 'harris');
      expect(femaleResult.bmr).toBeGreaterThan(1200);
    });

    it('should return 0 for invalid inputs', () => {
      const result = calculateBmr(0, 170, 25, 'male');
      expect(result.bmr).toBe(0);
      expect(result.tdee.sedentary).toBe(0);
    });
  });
});
