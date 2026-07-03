"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Gauge } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";
import { ReportCard } from "@/components/ReportCard";
import { Timeline } from "@/components/Timeline";
import type { AnalysisReport } from "@/lib/types";

export default function ReportPage() {
  const [report] = useState<AnalysisReport | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("forensight-report");
    return stored ? JSON.parse(stored) : null;
  });

  if (!report) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col items-center justify-center px-5 text-center">
        <AlertTriangle className="mb-4 text-amber" size={36} />
        <h1 className="text-2xl font-semibold">No report loaded</h1>
        <p className="mt-3 text-slate-400">Run an image analysis to view a forensic timeline report.</p>
        <Link href="/upload" className="mt-6 rounded bg-cyan px-5 py-3 font-semibold text-ink">Analyze Image</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/upload" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan">
        <ArrowLeft size={16} />
        New analysis
      </Link>

      <section className="mb-8 rounded-lg border border-line bg-panel/80 p-6 shadow-forensic">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-slate-400">{report.filename}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{report.assessment}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{report.disclaimer}</p>
          </div>
          <div className="grid min-w-[260px] grid-cols-2 gap-3">
            <div className="rounded border border-cyan/30 bg-cyan/10 p-4">
              <Gauge className="mb-2 text-cyan" size={22} />
              <p className="text-2xl font-semibold">{report.confidence_score}%</p>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Confidence</p>
            </div>
            <div className="rounded border border-amber/40 bg-amber/10 p-4">
              <p className="mb-2 text-sm font-semibold text-amber">AI estimate</p>
              <p className="text-2xl font-semibold">{report.ai_generated_likelihood}%</p>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Probable only</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-5 lg:grid-cols-2">
        <ImagePreview src={report.image_url} label="Uploaded image" />
        {report.ela_url && <ImagePreview src={report.ela_url} label="Error Level Analysis preview" />}
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {report.signals.map((signal) => (
          <ReportCard key={signal.key} signal={signal} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Timeline events={report.timeline} />
        <div className="rounded-lg border border-line bg-panel/80 p-5">
          <h2 className="mb-4 text-lg font-semibold">Evaluation Metrics</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Accuracy", report.metrics.accuracy],
              ["Precision", report.metrics.precision],
              ["Recall", report.metrics.recall],
              ["F1-score", report.metrics.f1_score],
              ["AUC-ROC", report.metrics.auc_roc],
              ["MAE", report.metrics.mae]
            ].map(([label, value]) => (
              <div key={label as string} className="rounded border border-line bg-ink/55 p-3">
                <p className="text-slate-400">{label as string}</p>
                <p className="mt-1 font-semibold">{value === null ? "Dataset needed" : value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{report.metrics.note}</p>
        </div>
      </section>
    </main>
  );
}
