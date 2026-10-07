import Decimal from 'decimal.js';

export type UnitCategory = 
  | 'pressure' 
  | 'energy' 
  | 'power' 
  | 'data' 
  | 'force' 
  | 'temperature' 
  | 'density';

export interface UnitDefinition {
  id: string;
  nameKey: string;
  symbol: string;
  // Multiplier to convert 1 unit to base unit
  toBaseMultiplier?: number | string;
  // Custom conversion for nonlinear units like temperature
  toBase?: (val: Decimal) => Decimal;
  fromBase?: (baseVal: Decimal) => Decimal;
}

export interface UnitCategoryConfig {
  id: UnitCategory;
  nameKey: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const SCIENTIFIC_CATEGORIES: UnitCategoryConfig[] = [
  {
    id: 'pressure',
    nameKey: 'catPressure',
    baseUnit: 'pa',
    units: [
      { id: 'pa', nameKey: 'unitPascal', symbol: 'Pa', toBaseMultiplier: 1 },
      { id: 'kpa', nameKey: 'unitKilopascal', symbol: 'kPa', toBaseMultiplier: 1e3 },
      { id: 'mpa', nameKey: 'unitMegapascal', symbol: 'MPa', toBaseMultiplier: 1e6 },
      { id: 'bar', nameKey: 'unitBar', symbol: 'bar', toBaseMultiplier: 1e5 },
      { id: 'mbar', nameKey: 'unitMillibar', symbol: 'mbar', toBaseMultiplier: 100 },
      { id: 'psi', nameKey: 'unitPsi', symbol: 'psi', toBaseMultiplier: 6894.757293168 },
      { id: 'atm', nameKey: 'unitAtmosphere', symbol: 'atm', toBaseMultiplier: 101325 },
      { id: 'torr', nameKey: 'unitTorr', symbol: 'Torr (mmHg)', toBaseMultiplier: 133.322368421 },
    ],
  },
  {
    id: 'energy',
    nameKey: 'catEnergy',
    baseUnit: 'j',
    units: [
      { id: 'j', nameKey: 'unitJoule', symbol: 'J', toBaseMultiplier: 1 },
      { id: 'kj', nameKey: 'unitKilojoule', symbol: 'kJ', toBaseMultiplier: 1e3 },
      { id: 'mj', nameKey: 'unitMegajoule', symbol: 'MJ', toBaseMultiplier: 1e6 },
      { id: 'wh', nameKey: 'unitWattHour', symbol: 'Wh', toBaseMultiplier: 3600 },
      { id: 'kwh', nameKey: 'unitKilowattHour', symbol: 'kWh', toBaseMultiplier: 3.6e6 },
      { id: 'mwh', nameKey: 'unitMegawattHour', symbol: 'MWh', toBaseMultiplier: 3.6e9 },
      { id: 'cal', nameKey: 'unitCalorie', symbol: 'cal', toBaseMultiplier: 4.184 },
      { id: 'kcal', nameKey: 'unitKilocalorie', symbol: 'kcal', toBaseMultiplier: 4184 },
      { id: 'btu', nameKey: 'unitBtu', symbol: 'BTU', toBaseMultiplier: 1055.05585262 },
      { id: 'ev', nameKey: 'unitElectronvolt', symbol: 'eV', toBaseMultiplier: '1.602176634e-19' },
    ],
  },
  {
    id: 'power',
    nameKey: 'catPower',
    baseUnit: 'w',
    units: [
      { id: 'w', nameKey: 'unitWatt', symbol: 'W', toBaseMultiplier: 1 },
      { id: 'kw', nameKey: 'unitKilowatt', symbol: 'kW', toBaseMultiplier: 1e3 },
      { id: 'mw', nameKey: 'unitMegawatt', symbol: 'MW', toBaseMultiplier: 1e6 },
      { id: 'gw', nameKey: 'unitGigawatt', symbol: 'GW', toBaseMultiplier: 1e9 },
      { id: 'hp_m', nameKey: 'unitHorsepowerMetric', symbol: 'hp (metric)', toBaseMultiplier: 735.49875 },
      { id: 'hp_mech', nameKey: 'unitHorsepowerMech', symbol: 'hp (imperial)', toBaseMultiplier: 745.699872 },
      { id: 'btu_h', nameKey: 'unitBtuPerHour', symbol: 'BTU/h', toBaseMultiplier: 0.29307107 },
    ],
  },
  {
    id: 'data',
    nameKey: 'catData',
    baseUnit: 'b',
    units: [
      { id: 'bit', nameKey: 'unitBit', symbol: 'bit', toBaseMultiplier: 0.125 },
      { id: 'b', nameKey: 'unitByte', symbol: 'B', toBaseMultiplier: 1 },
      { id: 'kb', nameKey: 'unitKilobyte', symbol: 'KB (1000 B)', toBaseMultiplier: 1000 },
      { id: 'kib', nameKey: 'unitKibibyte', symbol: 'KiB (1024 B)', toBaseMultiplier: 1024 },
      { id: 'mb', nameKey: 'unitMegabyte', symbol: 'MB (10^6 B)', toBaseMultiplier: 1e6 },
      { id: 'mib', nameKey: 'unitMebibyte', symbol: 'MiB (2^20 B)', toBaseMultiplier: 1048576 },
      { id: 'gb', nameKey: 'unitGigabyte', symbol: 'GB (10^9 B)', toBaseMultiplier: 1e9 },
      { id: 'gib', nameKey: 'unitGibibyte', symbol: 'GiB (2^30 B)', toBaseMultiplier: 1073741824 },
      { id: 'tb', nameKey: 'unitTerabyte', symbol: 'TB (10^12 B)', toBaseMultiplier: 1e12 },
      { id: 'tib', nameKey: 'unitTebibyte', symbol: 'TiB (2^40 B)', toBaseMultiplier: 1099511627776 },
    ],
  },
  {
    id: 'force',
    nameKey: 'catForce',
    baseUnit: 'n',
    units: [
      { id: 'n', nameKey: 'unitNewton', symbol: 'N', toBaseMultiplier: 1 },
      { id: 'kn', nameKey: 'unitKilonewton', symbol: 'kN', toBaseMultiplier: 1e3 },
      { id: 'mn', nameKey: 'unitMeganewton', symbol: 'MN', toBaseMultiplier: 1e6 },
      { id: 'dyn', nameKey: 'unitDyne', symbol: 'dyn', toBaseMultiplier: 1e-5 },
      { id: 'lbf', nameKey: 'unitPoundForce', symbol: 'lbf', toBaseMultiplier: 4.4482216152605 },
      { id: 'kgf', nameKey: 'unitKilogramForce', symbol: 'kgf', toBaseMultiplier: 9.80665 },
    ],
  },
  {
    id: 'temperature',
    nameKey: 'catTemperature',
    baseUnit: 'c',
    units: [
      { 
        id: 'c', 
        nameKey: 'unitCelsius', 
        symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      { 
        id: 'f', 
        nameKey: 'unitFahrenheit', 
        symbol: '°F',
        toBase: (v) => v.minus(32).times(5).dividedBy(9),
        fromBase: (v) => v.times(9).dividedBy(5).plus(32),
      },
      { 
        id: 'k', 
        nameKey: 'unitKelvin', 
        symbol: 'K',
        toBase: (v) => v.minus(273.15),
        fromBase: (v) => v.plus(273.15),
      },
      { 
        id: 'r', 
        nameKey: 'unitRankine', 
        symbol: '°R',
        toBase: (v) => v.minus(491.67).times(5).dividedBy(9),
        fromBase: (v) => v.plus(273.15).times(9).dividedBy(5),
      },
    ],
  },
  {
    id: 'density',
    nameKey: 'catDensity',
    baseUnit: 'kg_m3',
    units: [
      { id: 'kg_m3', nameKey: 'unitKgM3', symbol: 'kg/m³', toBaseMultiplier: 1 },
      { id: 'g_cm3', nameKey: 'unitGCm3', symbol: 'g/cm³', toBaseMultiplier: 1000 },
      { id: 'lb_ft3', nameKey: 'unitLbFt3', symbol: 'lb/ft³', toBaseMultiplier: 16.01846337 },
      { id: 'g_ml', nameKey: 'unitGMl', symbol: 'g/mL', toBaseMultiplier: 1000 },
    ],
  },
];

export interface ConversionMatrixItem {
  unitId: string;
  unitSymbol: string;
  nameKey: string;
  value: string;
  scientificNotation: string;
}

export function convertScientificUnit(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  value: number | string
): {
  resultValue: string;
  scientificResult: string;
  formulaDescription: string;
  matrix: ConversionMatrixItem[];
} {
  const catConfig = SCIENTIFIC_CATEGORIES.find((c) => c.id === category) || SCIENTIFIC_CATEGORIES[0];
  const fromUnit = catConfig.units.find((u) => u.id === fromUnitId) || catConfig.units[0];
  const toUnit = catConfig.units.find((u) => u.id === toUnitId) || catConfig.units[1] || catConfig.units[0];

  const valDecimal = new Decimal(value || 0);

  // Convert fromUnit to Base
  let baseVal: Decimal;
  if (fromUnit.toBase) {
    baseVal = fromUnit.toBase(valDecimal);
  } else {
    const mult = new Decimal(fromUnit.toBaseMultiplier ?? 1);
    baseVal = valDecimal.times(mult);
  }

  // Convert Base to toUnit
  let targetVal: Decimal;
  if (toUnit.fromBase) {
    targetVal = toUnit.fromBase(baseVal);
  } else {
    const mult = new Decimal(toUnit.toBaseMultiplier ?? 1);
    targetVal = baseVal.dividedBy(mult);
  }

  // Generate Matrix for all units in category
  const matrix: ConversionMatrixItem[] = catConfig.units.map((u) => {
    let uVal: Decimal;
    if (u.fromBase) {
      uVal = u.fromBase(baseVal);
    } else {
      const uMult = new Decimal(u.toBaseMultiplier ?? 1);
      uVal = baseVal.dividedBy(uMult);
    }

    const formatted = formatHighPrecision(uVal);
    const sci = uVal.toExponential(4);

    return {
      unitId: u.id,
      unitSymbol: u.symbol,
      nameKey: u.nameKey,
      value: formatted,
      scientificNotation: sci,
    };
  });

  const formattedResult = formatHighPrecision(targetVal);
  const sciResult = targetVal.toExponential(4);
  const formulaDescription = `1 ${fromUnit.symbol} = ${formatHighPrecision(convertRaw(catConfig, fromUnit, toUnit, new Decimal(1)))} ${toUnit.symbol}`;

  return {
    resultValue: formattedResult,
    scientificResult: sciResult,
    formulaDescription,
    matrix,
  };
}

function convertRaw(cat: UnitCategoryConfig, from: UnitDefinition, to: UnitDefinition, val: Decimal): Decimal {
  let base: Decimal;
  if (from.toBase) base = from.toBase(val);
  else base = val.times(new Decimal(from.toBaseMultiplier ?? 1));

  if (to.fromBase) return to.fromBase(base);
  return base.dividedBy(new Decimal(to.toBaseMultiplier ?? 1));
}

function formatHighPrecision(d: Decimal): string {
  if (d.abs().gte(1e9) || (d.abs().lt(1e-4) && !d.isZero())) {
    return d.toExponential(4);
  }
  const str = d.toFixed(6);
  // Strip trailing zeros
  return str.replace(/\.?0+$/, '');
}
