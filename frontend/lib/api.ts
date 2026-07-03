import type { AnalysisReport } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function analyzeImage(file: File): Promise<AnalysisReport> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Analysis failed.");
  }

  return payload as AnalysisReport;
}
