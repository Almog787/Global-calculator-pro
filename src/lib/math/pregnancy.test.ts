import { describe, it, expect } from 'vitest';
import { calculatePregnancy, getFetalDataForWeek, getZodiacSign } from './allCalculators';

describe('Pregnancy & Due Date Calculator Mathematical Test Suite', () => {
  it('should correctly calculate due date for standard 28-day cycle with LMP using Naegele\'s Rule', () => {
    // LMP: Jan 1, 2026 -> EDD: Oct 8, 2026 (+280 days)
    const result = calculatePregnancy({
      method: 'lmp',
      dateStr: '2026-01-01',
      cycleLength: 28,
    });

    expect(result.dueDate).toBe('2026-10-08');
    expect(result.conceptionDate).toBe('2026-01-15'); // 14 days after LMP
    expect(result.gestationalWeeks).toBeGreaterThanOrEqual(0);
    expect(result.totalDaysPregnant).toBeGreaterThanOrEqual(0);
    expect(result.progressPercent).toBeGreaterThanOrEqual(0);
    expect(result.progressPercent).toBeLessThanOrEqual(100);
  });

  it('should adjust due date correctly when menstrual cycle is longer or shorter than 28 days', () => {
    // 35-day cycle (+7 days later ovulation)
    const longCycle = calculatePregnancy({
      method: 'lmp',
      dateStr: '2026-01-01',
      cycleLength: 35,
    });
    // Due date should be 7 days later than standard (Oct 15 instead of Oct 8)
    expect(longCycle.dueDate).toBe('2026-10-15');

    // 24-day cycle (-4 days earlier ovulation)
    const shortCycle = calculatePregnancy({
      method: 'lmp',
      dateStr: '2026-01-01',
      cycleLength: 24,
    });
    // Due date should be 4 days earlier (Oct 4 instead of Oct 8)
    expect(shortCycle.dueDate).toBe('2026-10-04');
  });

  it('should calculate due date from conception date (+266 days)', () => {
    const result = calculatePregnancy({
      method: 'conception',
      dateStr: '2026-02-14',
    });

    // Conception + 266 days = Nov 7, 2026
    expect(result.dueDate).toBe('2026-11-07');
    expect(result.conceptionDate).toBe('2026-02-14');
  });

  it('should reverse calculate conception and LMP from known due date', () => {
    const result = calculatePregnancy({
      method: 'due_date',
      dateStr: '2026-12-25',
    });

    expect(result.dueDate).toBe('2026-12-25');
    // Conception is 266 days before due date (April 3, 2026)
    expect(result.conceptionDate).toBe('2026-04-03');
  });

  it('should correctly calculate IVF Day 3 and Day 5 blastocyst transfers', () => {
    const ivfDay5 = calculatePregnancy({
      method: 'ivf_day5',
      dateStr: '2026-03-01',
    });
    // Day 5 transfer + 261 days = Nov 17, 2026
    expect(ivfDay5.dueDate).toBe('2026-11-17');

    const ivfDay3 = calculatePregnancy({
      method: 'ivf_day3',
      dateStr: '2026-03-01',
    });
    // Day 3 transfer + 263 days = Nov 19, 2026
    expect(ivfDay3.dueDate).toBe('2026-11-19');
  });

  it('should accurately categorize trimesters based on gestational age', () => {
    // 8 weeks ago -> Trimester 1
    const d1 = new Date();
    d1.setDate(d1.getDate() - 56);
    const tri1 = calculatePregnancy({
      method: 'lmp',
      dateStr: d1.toISOString().split('T')[0],
      cycleLength: 28,
    });
    expect(tri1.trimester).toBe(1);

    // 20 weeks ago -> Trimester 2
    const d2 = new Date();
    d2.setDate(d2.getDate() - 140);
    const tri2 = calculatePregnancy({
      method: 'lmp',
      dateStr: d2.toISOString().split('T')[0],
      cycleLength: 28,
    });
    expect(tri2.trimester).toBe(2);

    // 32 weeks ago -> Trimester 3
    const d3 = new Date();
    d3.setDate(d3.getDate() - 224);
    const tri3 = calculatePregnancy({
      method: 'lmp',
      dateStr: d3.toISOString().split('T')[0],
      cycleLength: 28,
    });
    expect(tri3.trimester).toBe(3);
  });

  it('should correctly identify full term when gestational age is 37 weeks or greater', () => {
    const d = new Date();
    d.setDate(d.getDate() - 266); // 38 weeks
    const res = calculatePregnancy({
      method: 'lmp',
      dateStr: d.toISOString().split('T')[0],
      cycleLength: 28,
    });
    expect(res.isFullTerm).toBe(true);
  });

  it('should return valid fetal growth comparisons for all weeks', () => {
    for (const week of [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]) {
      const data = getFetalDataForWeek(week);
      expect(data.week).toBe(week);
      expect(data.lengthCm).toBeGreaterThan(0);
      expect(data.weightGrams).toBeGreaterThan(0);
      expect(data.fruit.he).toBeTruthy();
      expect(data.fruit.en).toBeTruthy();
      expect(data.highlight.he).toBeTruthy();
    }
  });

  it('should compute valid zodiac signs for all months', () => {
    expect(getZodiacSign(1, 15)).toBe('capricorn');
    expect(getZodiacSign(3, 25)).toBe('aries');
    expect(getZodiacSign(7, 10)).toBe('cancer');
    expect(getZodiacSign(11, 5)).toBe('scorpio');
  });

  it('should never crash on invalid, undefined, null or empty inputs', () => {
    expect(() => calculatePregnancy(null as any)).not.toThrow();
    expect(() => calculatePregnancy(undefined as any)).not.toThrow();
    expect(() => calculatePregnancy('')).not.toThrow();
    expect(() => calculatePregnancy('not-a-date', 'lmp', -5)).not.toThrow();
    expect(() => calculatePregnancy({ method: 'invalid' as any, dateStr: 'abc', cycleLength: NaN })).not.toThrow();
  });
});
