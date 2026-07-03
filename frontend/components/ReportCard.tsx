import type { Signal } from "@/lib/types";
import { SignalBadge } from "@/components/SignalBadge";

export function ReportCard({ signal }: { signal: Signal }) {
  return (
    <article className="rounded-lg border border-line bg-panel/80 p-5 shadow-forensic">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-100">{signal.label}</h3>
          <p className="mt-1 text-sm text-slate-400">Score {(signal.score * 100).toFixed(0)}%</p>
        </div>
        <SignalBadge status={signal.status} />
      </div>
      <p className="text-sm leading-6 text-slate-300">{signal.explanation}</p>
    </article>
  );
}
