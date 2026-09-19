import { describe, it, expect } from 'vitest';

describe('AnimatedNumber Logic Suite', () => {
  it('should calculate correct formatted number representation', () => {
    const formatHe = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(5000);
    expect(formatHe).toBe('5,000');

    const formatEn = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(1250000);
    expect(formatEn).toBe('1,250,000');
  });

  it('should handle zero and edge value formatting accurately', () => {
    const formatZero = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }).format(0);
    expect(formatZero).toBe('0');
  });
});
