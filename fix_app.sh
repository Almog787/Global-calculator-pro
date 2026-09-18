#!/bin/bash
FILES=("AgeCalculator" "BmiCalculator" "CompoundInterest" "MortgageCalculator" "PercentageFinder" "SalaryCalculator" "TipCalculator" "UnitConverter")

for file in "${FILES[@]}"; do
  sed -i "s/import('\.\/pages\/$file')/import('\.\/pages\/calculators\/$file')/g" src/App.tsx
done
