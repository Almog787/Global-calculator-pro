export interface QuizOption {
  id: string;
  icon: string;
  label: string;
  desc?: string;
  nextStepId?: string;
  targetPath?: string;
  calculatorId?: string;
}

export interface QuizStep {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

export interface AssistantTip {
  id: string;
  category: "finance" | "real-estate" | "health" | "math" | "tech";
  icon: string;
  title: string;
  summary: string;
}
