import Decimal from 'decimal.js';

export interface CityCostData {
  id: string;
  name: {
    en: string;
    he: string;
    es: string;
    fr: string;
    ar: string;
    ru: string;
  };
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  // Numbeo / Mercer scaled indices where New York = 100
  cpiIndex: number;          // Consumer Price Index (excluding rent)
  rentIndex: number;         // Rent Index
  groceriesIndex: number;    // Groceries Index
  restaurantIndex: number;   // Dining Out Index
  localPurchasingPowerIndex: number; // Local purchasing power index
  avgMonthlyNetSalaryLocal: number; // Average monthly net salary in local currency
}

export const GLOBAL_CITIES_COST_DATA: Record<string, CityCostData> = {
  'tel-aviv': {
    id: 'tel-aviv',
    name: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      es: 'Tel Aviv',
      fr: 'Tel Aviv',
      ar: 'تل أبيب',
      ru: 'Тель-Авив',
    },
    country: 'Israel',
    countryCode: 'IL',
    flag: '🇮🇱',
    currency: 'ILS',
    currencySymbol: '₪',
    cpiIndex: 82.5,
    rentIndex: 52.4,
    groceriesIndex: 78.9,
    restaurantIndex: 84.1,
    localPurchasingPowerIndex: 78.4,
    avgMonthlyNetSalaryLocal: 12500,
  },
  'singapore': {
    id: 'singapore',
    name: {
      en: 'Singapore',
      he: 'סינגפור',
      es: 'Singapur',
      fr: 'Singapour',
      ar: 'سنغافورة',
      ru: 'Сингапур',
    },
    country: 'Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    cpiIndex: 85.9,
    rentIndex: 79.2,
    groceriesIndex: 75.4,
    restaurantIndex: 62.8,
    localPurchasingPowerIndex: 91.2,
    avgMonthlyNetSalaryLocal: 6200,
  },
  'new-york': {
    id: 'new-york',
    name: {
      en: 'New York City',
      he: 'ניו יורק',
      es: 'Nueva York',
      fr: 'New York',
      ar: 'نيويورك',
      ru: 'Нью-Йорк',
    },
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    cpiIndex: 100.0,
    rentIndex: 100.0,
    groceriesIndex: 100.0,
    restaurantIndex: 100.0,
    localPurchasingPowerIndex: 100.0,
    avgMonthlyNetSalaryLocal: 6800,
  },
  'london': {
    id: 'london',
    name: {
      en: 'London',
      he: 'לונדון',
      es: 'Londres',
      fr: 'Londres',
      ar: 'لندن',
      ru: 'Лондон',
    },
    country: 'United Kingdom',
    countryCode: 'UK',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    cpiIndex: 81.2,
    rentIndex: 71.5,
    groceriesIndex: 68.3,
    restaurantIndex: 82.7,
    localPurchasingPowerIndex: 88.5,
    avgMonthlyNetSalaryLocal: 3800,
  },
  'paris': {
    id: 'paris',
    name: {
      en: 'Paris',
      he: 'פריז',
      es: 'París',
      fr: 'Paris',
      ar: 'باريس',
      ru: 'Париж',
    },
    country: 'France',
    countryCode: 'EU',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    cpiIndex: 76.8,
    rentIndex: 44.6,
    groceriesIndex: 72.1,
    restaurantIndex: 75.9,
    localPurchasingPowerIndex: 82.3,
    avgMonthlyNetSalaryLocal: 2950,
  },
  'berlin': {
    id: 'berlin',
    name: {
      en: 'Berlin',
      he: 'ברלין',
      es: 'Berlín',
      fr: 'Berlin',
      ar: 'برلين',
      ru: 'Берлин',
    },
    country: 'Germany',
    countryCode: 'EU',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    cpiIndex: 68.4,
    rentIndex: 38.2,
    groceriesIndex: 61.5,
    restaurantIndex: 62.1,
    localPurchasingPowerIndex: 94.7,
    avgMonthlyNetSalaryLocal: 3100,
  },
  'madrid': {
    id: 'madrid',
    name: {
      en: 'Madrid',
      he: 'מדריד',
      es: 'Madrid',
      fr: 'Madrid',
      ar: 'مดريد',
      ru: 'Мадрид',
    },
    country: 'Spain',
    countryCode: 'EU',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    cpiIndex: 58.2,
    rentIndex: 32.1,
    groceriesIndex: 50.4,
    restaurantIndex: 56.8,
    localPurchasingPowerIndex: 76.1,
    avgMonthlyNetSalaryLocal: 2150,
  },
  'dubai': {
    id: 'dubai',
    name: {
      en: 'Dubai',
      he: 'דובאי',
      es: 'Dubái',
      fr: 'Dubaï',
      ar: 'دبي',
      ru: 'Дубай',
    },
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'د.إ',
    cpiIndex: 65.4,
    rentIndex: 58.7,
    groceriesIndex: 49.8,
    restaurantIndex: 61.2,
    localPurchasingPowerIndex: 102.4,
    avgMonthlyNetSalaryLocal: 15500,
  },
  'tokyo': {
    id: 'tokyo',
    name: {
      en: 'Tokyo',
      he: 'טוקיו',
      es: 'Tokio',
      fr: 'Tokyo',
      ar: 'طوكيو',
      ru: 'Токио',
    },
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    cpiIndex: 62.1,
    rentIndex: 31.4,
    groceriesIndex: 65.2,
    restaurantIndex: 43.8,
    localPurchasingPowerIndex: 71.8,
    avgMonthlyNetSalaryLocal: 380000,
  },
  'sydney': {
    id: 'sydney',
    name: {
      en: 'Sydney',
      he: 'סידני',
      es: 'Sídney',
      fr: 'Sydney',
      ar: 'سيدني',
      ru: 'Сидней',
    },
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    cpiIndex: 79.8,
    rentIndex: 56.1,
    groceriesIndex: 73.6,
    restaurantIndex: 72.4,
    localPurchasingPowerIndex: 96.3,
    avgMonthlyNetSalaryLocal: 5400,
  },
  'zurich': {
    id: 'zurich',
    name: {
      en: 'Zurich',
      he: 'ציריך',
      es: 'Zúrich',
      fr: 'Zurich',
      ar: 'زوريخ',
      ru: 'Цюрих',
    },
    country: 'Switzerland',
    countryCode: 'CH',
    flag: '🇨🇭',
    currency: 'CHF',
    currencySymbol: 'CHF',
    cpiIndex: 122.4,
    rentIndex: 68.9,
    groceriesIndex: 118.6,
    restaurantIndex: 112.1,
    localPurchasingPowerIndex: 118.2,
    avgMonthlyNetSalaryLocal: 7200,
  },
  'toronto': {
    id: 'toronto',
    name: {
      en: 'Toronto',
      he: 'טורונטו',
      es: 'Toronto',
      fr: 'Toronto',
      ar: 'تورونتو',
      ru: 'Торонто',
    },
    country: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    cpiIndex: 71.3,
    rentIndex: 48.2,
    groceriesIndex: 66.8,
    restaurantIndex: 67.5,
    localPurchasingPowerIndex: 89.1,
    avgMonthlyNetSalaryLocal: 4200,
  },
};

// Fallback exchange rates to USD if offline
export const DEFAULT_EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  ILS: 3.68,
  SGD: 1.34,
  GBP: 0.79,
  EUR: 0.92,
  AED: 3.67,
  JPY: 152.4,
  AUD: 1.52,
  CHF: 0.88,
  CAD: 1.39,
};

export interface PurchasingPowerCalculationInput {
  sourceCityId: string;
  targetCityId: string;
  sourceMonthlySalary: number;
  customExchangeRate?: number; // Optional user override for rate
}

export interface PurchasingPowerCalculationResult {
  sourceCity: CityCostData;
  targetCity: CityCostData;
  sourceSalary: number;
  // Equivalent salary in target currency needed to maintain exact same living standard
  equivalentTargetSalary: number;
  // Purchasing power ratio multiplier (>1 means target city is cheaper/gives more purchasing power)
  purchasingPowerMultiplier: number;
  // Percentage difference in overall living cost (+25% means target city is 25% more expensive)
  livingCostDiffPercentage: number;
  // Rent cost difference percentage
  rentDiffPercentage: number;
  // Groceries cost difference percentage
  groceriesDiffPercentage: number;
  // Restaurant/Dining cost difference percentage
  restaurantDiffPercentage: number;
  // Exchange rate used (source currency to target currency)
  exchangeRateSourceToTarget: number;
  // Comparative purchasing power index
  relativePurchasingPowerDiff: number;
}

export function calculatePurchasingPower(
  input: PurchasingPowerCalculationInput
): PurchasingPowerCalculationResult {
  const source = GLOBAL_CITIES_COST_DATA[input.sourceCityId] || GLOBAL_CITIES_COST_DATA['tel-aviv'];
  const target = GLOBAL_CITIES_COST_DATA[input.targetCityId] || GLOBAL_CITIES_COST_DATA['singapore'];

  const sourceSalary = new Decimal(Math.max(0, input.sourceMonthlySalary || 0));

  // Determine exchange rate: Source Currency -> Target Currency
  let exchangeRateSourceToTarget = 1.0;
  if (input.customExchangeRate && input.customExchangeRate > 0) {
    exchangeRateSourceToTarget = input.customExchangeRate;
  } else if (source.currency !== target.currency) {
    const sourceToUsd = DEFAULT_EXCHANGE_RATES_TO_USD[source.currency] || 1.0;
    const targetToUsd = DEFAULT_EXCHANGE_RATES_TO_USD[target.currency] || 1.0;
    // 1 Source Unit in Target Currency = (1 / sourceToUsd) * targetToUsd
    exchangeRateSourceToTarget = new Decimal(targetToUsd).div(sourceToUsd).toNumber();
  }

  // Combined Cost of Living + Rent Index (Numbeo standard formula: 0.65 * CPI + 0.35 * Rent)
  const sourceCombinedIndex = new Decimal(source.cpiIndex).mul(0.65).add(new Decimal(source.rentIndex).mul(0.35));
  const targetCombinedIndex = new Decimal(target.cpiIndex).mul(0.65).add(new Decimal(target.rentIndex).mul(0.35));

  // Index Ratio: How much target city costs compared to source city
  const indexRatio = targetCombinedIndex.div(sourceCombinedIndex);

  // Equivalent Salary in Target Currency = Source Salary * Exchange Rate * Index Ratio
  const equivalentTargetSalary = sourceSalary
    .mul(exchangeRateSourceToTarget)
    .mul(indexRatio)
    .toDecimalPlaces(0)
    .toNumber();

  // Percentage differences
  const livingCostDiffPercentage = indexRatio.sub(1).mul(100).toDecimalPlaces(1).toNumber();
  const rentDiffPercentage = new Decimal(target.rentIndex)
    .div(source.rentIndex)
    .sub(1)
    .mul(100)
    .toDecimalPlaces(1)
    .toNumber();
  const groceriesDiffPercentage = new Decimal(target.groceriesIndex)
    .div(source.groceriesIndex)
    .sub(1)
    .mul(100)
    .toDecimalPlaces(1)
    .toNumber();
  const restaurantDiffPercentage = new Decimal(target.restaurantIndex)
    .div(source.restaurantIndex)
    .sub(1)
    .mul(100)
    .toDecimalPlaces(1)
    .toNumber();

  // Purchasing power multiplier
  const purchasingPowerMultiplier = new Decimal(1).div(indexRatio).toDecimalPlaces(2).toNumber();

  // Relative purchasing power index difference
  const relativePurchasingPowerDiff = new Decimal(target.localPurchasingPowerIndex)
    .sub(source.localPurchasingPowerIndex)
    .toDecimalPlaces(1)
    .toNumber();

  return {
    sourceCity: source,
    targetCity: target,
    sourceSalary: sourceSalary.toNumber(),
    equivalentTargetSalary,
    purchasingPowerMultiplier,
    livingCostDiffPercentage,
    rentDiffPercentage,
    groceriesDiffPercentage,
    restaurantDiffPercentage,
    exchangeRateSourceToTarget: new Decimal(exchangeRateSourceToTarget).toDecimalPlaces(4).toNumber(),
    relativePurchasingPowerDiff,
  };
}
