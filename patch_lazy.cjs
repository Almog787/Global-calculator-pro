const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard imports with lazy imports
code = code.replace(/import MortgageCalculator from '.\/pages\/MortgageCalculator';/, "const MortgageCalculator = lazy(() => import('./pages/MortgageCalculator'));");
code = code.replace(/import CompoundInterest from '.\/pages\/CompoundInterest';/, "const CompoundInterest = lazy(() => import('./pages/CompoundInterest'));");
code = code.replace(/import PercentageFinder from '.\/pages\/PercentageFinder';/, "const PercentageFinder = lazy(() => import('./pages/PercentageFinder'));");
code = code.replace(/import UnitConverter from '.\/pages\/UnitConverter';/, "const UnitConverter = lazy(() => import('./pages/UnitConverter'));");
code = code.replace(/import BmiCalculator from '.\/pages\/BmiCalculator';/, "const BmiCalculator = lazy(() => import('./pages/BmiCalculator'));");
code = code.replace(/import TipCalculator from '.\/pages\/TipCalculator';/, "const TipCalculator = lazy(() => import('./pages/TipCalculator'));");
code = code.replace(/import SalaryCalculator from '.\/pages\/SalaryCalculator';/, "const SalaryCalculator = lazy(() => import('./pages/SalaryCalculator'));");
code = code.replace(/import AgeCalculator from '.\/pages\/AgeCalculator';/, "const AgeCalculator = lazy(() => import('./pages/AgeCalculator'));");

// Add lazy and Suspense to React imports
code = code.replace(/import \{ Routes, Route, Link, useLocation, Navigate \} from 'react-router-dom';/, "import { lazy, Suspense } from 'react';\nimport { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';");

// Wrap Routes in Suspense
code = code.replace(/<Routes>/, '<Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div></div>}>\n        <Routes>');
code = code.replace(/<\/Routes>/, '</Routes>\n        </Suspense>');

fs.writeFileSync('src/App.tsx', code);
