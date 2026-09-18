#!/bin/bash
FILES=("AgeCalculator.tsx" "BmiCalculator.tsx" "CompoundInterest.tsx" "MortgageCalculator.tsx" "PercentageFinder.tsx" "SalaryCalculator.tsx" "TipCalculator.tsx" "UnitConverter.tsx")

for file in "${FILES[@]}"; do
  # Move the file
  mv "src/pages/$file" "src/pages/calculators/$file"
  
  # Rewrite imports from '../' to '../../'
  sed -i "s/from '..\//from '..\/..\//g" "src/pages/calculators/$file"
  
  # Update App.tsx imports
  sed -i "s/import('\.\/pages\/$file/import('\.\/pages\/calculators\/$file/g" src/App.tsx
done
