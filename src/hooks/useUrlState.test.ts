import { describe, it, expect } from 'vitest';
import { sanitizeUrlValue } from './useUrlState';

describe('useUrlState Security & Sanitization', () => {
  describe('Numeric Parameter Sanitization', () => {
    it('should parse valid numbers', () => {
      expect(sanitizeUrlValue('1000000', 500000)).toBe(1000000);
      expect(sanitizeUrlValue('4.75', 3.5)).toBe(4.75);
      expect(sanitizeUrlValue('0', 100)).toBe(0);
      expect(sanitizeUrlValue('-50', 0)).toBe(-50);
    });

    it('should reject NaN and invalid strings and fall back to default', () => {
      expect(sanitizeUrlValue('abc', 100)).toBe(100);
      expect(sanitizeUrlValue('<script>alert(1)</script>', 250)).toBe(250);
      expect(sanitizeUrlValue('', 50)).toBe(50);
    });

    it('should reject Infinity and -Infinity to avoid mathematical DoS', () => {
      expect(sanitizeUrlValue('Infinity', 100)).toBe(100);
      expect(sanitizeUrlValue('-Infinity', 100)).toBe(100);
      expect(sanitizeUrlValue('1e309', 100)).toBe(100); // Exceeds JS Number limit -> Infinity
    });
  });

  describe('Boolean Parameter Sanitization', () => {
    it('should correctly parse true and false boolean representations', () => {
      expect(sanitizeUrlValue('true', false)).toBe(true);
      expect(sanitizeUrlValue('1', false)).toBe(true);
      expect(sanitizeUrlValue('false', true)).toBe(false);
      expect(sanitizeUrlValue('0', true)).toBe(false);
    });

    it('should fallback to default for malformed booleans', () => {
      expect(sanitizeUrlValue('maybe', true)).toBe(true);
      expect(sanitizeUrlValue('yes', false)).toBe(false);
    });
  });

  describe('String Parameter Sanitization', () => {
    it('should strip dangerous non-printable control characters', () => {
      const malicious = 'Hello\u0000\u001FWorld';
      expect(sanitizeUrlValue(malicious, '')).toBe('HelloWorld');
    });

    it('should truncate excessively long strings to prevent memory exhaustion', () => {
      const oversized = 'a'.repeat(2000);
      const sanitized = sanitizeUrlValue(oversized, '');
      expect(sanitized.length).toBe(1000);
    });

    it('should return defaultValue when param is null or undefined', () => {
      expect(sanitizeUrlValue(null, 'defaultVal')).toBe('defaultVal');
      expect(sanitizeUrlValue(undefined, 'defaultVal')).toBe('defaultVal');
    });
  });
});
