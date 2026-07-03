import type { SignalStatus } from "@/lib/types";

const styles: Record<SignalStatus, string> = {
  low: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber/50 bg-amber/10 text-amber",
  high: "border-danger/50 bg-danger/10 text-red-200",
  info: "border-cyan/40 bg-cyan/10 text-cyan"
};

export function SignalBadge({ status }: { status: SignalStatus }) {
  return <span className={`rounded border px-2.5 py-1 text-xs font-semibold uppercase ${styles[status]}`}>{status}</span>;
}
