import { describe, it, expect } from 'vitest';
import { convertScientificUnit, SCIENTIFIC_CATEGORIES } from './scientificUnits';

describe('Scientific & Engineering Unit Engine', () => {
  it('converts pressure units accurately (bar to psi and pa)', () => {
    const res = convertScientificUnit('pressure', 'bar', 'psi', 1);
    expect(parseFloat(res.resultValue)).toBeCloseTo(14.5038, 2);

    const paRes = convertScientificUnit('pressure', 'bar', 'pa', 1);
    expect(paRes.resultValue).toBe('100000');
  });

  it('converts energy units correctly (kWh to Joules and kcal)', () => {
    const res = convertScientificUnit('energy', 'kwh', 'j', 1);
    expect(res.resultValue).toBe('3600000');

    const kcalRes = convertScientificUnit('energy', 'j', 'cal', 4.184);
    expect(kcalRes.resultValue).toBe('1');
  });

  it('converts temperature nonlinearly (Celsius to Fahrenheit and Kelvin)', () => {
    const cToF = convertScientificUnit('temperature', 'c', 'f', 100);
    expect(cToF.resultValue).toBe('212');

    const cToK = convertScientificUnit('temperature', 'c', 'k', 0);
    expect(cToK.resultValue).toBe('273.15');
  });

  it('provides complete matrix for all units in category', () => {
    const res = convertScientificUnit('power', 'kw', 'hp_mech', 100);
    expect(res.matrix.length).toBe(SCIENTIFIC_CATEGORIES.find(c => c.id === 'power')?.units.length);
    expect(parseFloat(res.resultValue)).toBeCloseTo(134.1, 1);
  });
});
