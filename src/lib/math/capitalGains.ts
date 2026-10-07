import Decimal from 'decimal.js';

export interface CapitalGainsOptions {
  buyAmount: number;
  sellAmount: number;
  totalInflationPercent?: number; // Total CPI increase between purchase & sale dates (e.g. 12.5%)
  lossCarryforward?: number; // Past capital losses available to offset (e.g. 5,000)
  taxRatePercent?: number; // Default 25% (real gain) or 15% (nominal for unlinked bonds)
  isNominalOnly?: boolean; // If true, tax is calculated on nominal gain without indexation
}

export interface CapitalGainsResult {
  nominalGain: number;
  adjustedBasis: number;
  inflationGain: number; // Tax-free inflationary gain
  realGain: number; // Taxable real gain
  lossOffsetApplied: number;
  taxableGainAfterOffset: number;
  taxDue: number;
  netProceedsAfterTax: number;
  netProfitAfterTax: number;
  effectiveTaxRatePercent: number;
}

export function calculateCapitalGains(options: CapitalGainsOptions): CapitalGainsResult {
  const buy = new Decimal(Math.max(0, options.buyAmount || 0));
  const sell = new Decimal(Math.max(0, options.sellAmount || 0));
  const inflationRate = new Decimal(Math.max(0, options.totalInflationPercent || 0)).div(100);
  const lossOffset = new Decimal(Math.max(0, options.lossCarryforward || 0));
  const taxRate = new Decimal(Math.max(0, options.taxRatePercent ?? 25)).div(100);
  const isNominalOnly = Boolean(options.isNominalOnly);

  // Nominal gain = Sell - Buy
  const nominalGain = sell.sub(buy);

  // If sell <= buy, it is a capital loss
  if (nominalGain.lte(0)) {
    return {
      nominalGain: nominalGain.toNumber(),
      adjustedBasis: buy.toNumber(),
      inflationGain: 0,
      realGain: nominalGain.toNumber(),
      lossOffsetApplied: 0,
      taxableGainAfterOffset: 0,
      taxDue: 0,
      netProceedsAfterTax: sell.toNumber(),
      netProfitAfterTax: nominalGain.toNumber(),
      effectiveTaxRatePercent: 0,
    };
  }

  // Adjusted purchase price (Basis adjusted for inflation)
  const adjustedBasis = isNominalOnly ? buy : buy.mul(new Decimal(1).add(inflationRate));
  
  // Inflationary gain component (exempt from tax in real capital gains regime)
  const rawInflationGain = isNominalOnly ? new Decimal(0) : adjustedBasis.sub(buy);
  const inflationGain = Decimal.min(rawInflationGain, nominalGain);

  // Real Gain = Sell - Adjusted Basis
  const rawRealGain = isNominalOnly ? nominalGain : sell.sub(adjustedBasis);
  const realGain = Decimal.max(0, rawRealGain);

  // Apply loss carryforward
  const lossOffsetApplied = Decimal.min(realGain, lossOffset);
  const taxableGainAfterOffset = Decimal.max(0, realGain.sub(lossOffsetApplied));

  // Tax due = Taxable Gain * Tax Rate
  const taxDue = taxableGainAfterOffset.mul(taxRate);

  // Net Proceeds = Total Sell Amount - Tax Due
  const netProceedsAfterTax = sell.sub(taxDue);
  const netProfitAfterTax = nominalGain.sub(taxDue);

  const effectiveTaxRate = nominalGain.gt(0) ? taxDue.div(nominalGain).mul(100) : new Decimal(0);

  return {
    nominalGain: Number(nominalGain.toFixed(2)),
    adjustedBasis: Number(adjustedBasis.toFixed(2)),
    inflationGain: Number(inflationGain.toFixed(2)),
    realGain: Number(realGain.toFixed(2)),
    lossOffsetApplied: Number(lossOffsetApplied.toFixed(2)),
    taxableGainAfterOffset: Number(taxableGainAfterOffset.toFixed(2)),
    taxDue: Number(taxDue.toFixed(2)),
    netProceedsAfterTax: Number(netProceedsAfterTax.toFixed(2)),
    netProfitAfterTax: Number(netProfitAfterTax.toFixed(2)),
    effectiveTaxRatePercent: Number(effectiveTaxRate.toFixed(2)),
  };
}
