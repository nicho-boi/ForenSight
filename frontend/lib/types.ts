export type SignalStatus = "low" | "medium" | "high" | "info";

export type Signal = {
  key: string;
  label: string;
  status: SignalStatus;
  score: number;
  explanation: string;
};

export type TimelineEvent = {
  step: number;
  title: string;
  description: string;
  risk: SignalStatus;
};

export type Metrics = {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1_score: number | null;
  auc_roc: number | null;
  mae: number | null;
  confusion_matrix: number[][] | null;
  note: string;
};

export type AnalysisReport = {
  id: string;
  filename: string;
  assessment: string;
  confidence_score: number;
  ai_generated_likelihood: number;
  image_url: string;
  ela_url: string | null;
  timeline: TimelineEvent[];
  signals: Signal[];
  metadata: Record<string, unknown>;
  metrics: Metrics;
  disclaimer: string;
};
