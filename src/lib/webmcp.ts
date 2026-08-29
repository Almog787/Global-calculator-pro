/**
 * WebMCP (Web Model Context Protocol) tool registration helper for AI Agents.
 * Exposes core calculation tools to browser-based AI agents.
 */

interface WebMCPTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => unknown;
}

export function initWebMCP() {
  if (typeof window === 'undefined') return;

  const tools: WebMCPTool[] = [
    {
      name: 'calculate_mortgage',
      description: 'Calculate monthly mortgage payment, total interest, and total payment.',
      parameters: {
        type: 'object',
        properties: {
          principal: { type: 'number', description: 'Loan principal amount' },
          rate: { type: 'number', description: 'Annual interest rate percentage (e.g., 4.5)' },
          years: { type: 'number', description: 'Loan duration in years (e.g., 30)' },
        },
        required: ['principal', 'rate', 'years'],
      },
      execute: (args: Record<string, unknown>) => {
        const principal = Number(args.principal) || 0;
        const rate = Number(args.rate) || 0;
        const years = Number(args.years) || 0;
        const monthlyRate = rate / 100 / 12;
        const totalPayments = years * 12;
        if (monthlyRate === 0) {
          return { monthlyPayment: totalPayments > 0 ? principal / totalPayments : 0, totalInterest: 0, totalPayment: principal };
        }
        const monthlyPayment =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);
        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - principal;
        return { monthlyPayment, totalInterest, totalPayment };
      },
    },
    {
      name: 'calculate_compound_interest',
      description: 'Calculate future investment value with recurring monthly deposits and compound interest.',
      parameters: {
        type: 'object',
        properties: {
          principal: { type: 'number', description: 'Initial deposit' },
          contribution: { type: 'number', description: 'Monthly contribution deposit' },
          rate: { type: 'number', description: 'Annual interest rate percentage' },
          years: { type: 'number', description: 'Investment horizon in years' },
        },
        required: ['principal', 'rate', 'years'],
      },
      execute: (args: Record<string, unknown>) => {
        const principal = Number(args.principal) || 0;
        const contribution = Number(args.contribution) || 0;
        const rate = Number(args.rate) || 0;
        const years = Number(args.years) || 0;
        const months = years * 12;
        const monthlyRate = rate / 100 / 12;
        let futureValue = principal;
        let totalContributions = principal;

        for (let i = 0; i < months; i++) {
          futureValue = (futureValue + contribution) * (1 + monthlyRate);
          totalContributions += contribution;
        }
        const totalInterestEarned = futureValue - totalContributions;
        return { futureValue, totalContributions, totalInterestEarned };
      },
    },
    {
      name: 'calculate_bmi',
      description: 'Calculate Body Mass Index (BMI) and health category.',
      parameters: {
        type: 'object',
        properties: {
          weightKg: { type: 'number', description: 'Weight in kilograms' },
          heightCm: { type: 'number', description: 'Height in centimeters' },
        },
        required: ['weightKg', 'heightCm'],
      },
      execute: (args: Record<string, unknown>) => {
        const weightKg = Number(args.weightKg) || 0;
        const heightCm = Number(args.heightCm) || 0;
        const heightM = heightCm / 100;
        const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;
        let category = 'Normal';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 25 && bmi < 30) category = 'Overweight';
        else if (bmi >= 30) category = 'Obese';
        return { bmi: Math.round(bmi * 10) / 10, category };
      },
    },
  ];

  // Polyfill/expose navigator.modelContextProtocol / window.webMCP if supported or initialized by agent extensions
  const modelContext = (navigator as unknown as Record<string, unknown>).modelContextProtocol ||
    (navigator as unknown as Record<string, unknown>).modelContext ||
    (window as unknown as Record<string, unknown>).webMCP ||
    {};

  if (typeof (modelContext as Record<string, unknown>).registerTool === 'function') {
    tools.forEach((t) => {
      try {
        (modelContext as { registerTool: (tool: WebMCPTool) => void }).registerTool(t);
      } catch (err) {
        console.debug('WebMCP registration error:', err);
      }
    });
  }

  // Attach registered WebMCP tools schema to window object for AI WebMCP inspection
  (window as unknown as Record<string, unknown>).__WEBMCP_TOOLS__ = tools;
}
