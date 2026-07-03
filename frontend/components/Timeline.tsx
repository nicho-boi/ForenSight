import type { TimelineEvent } from "@/lib/types";
import { SignalBadge } from "@/components/SignalBadge";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-lg border border-line bg-panel/80 p-5">
      <h2 className="mb-5 text-lg font-semibold">Estimated Manipulation Timeline</h2>
      <div className="space-y-5">
        {events.map((event) => (
          <div key={`${event.step}-${event.title}`} className="grid grid-cols-[36px_1fr] gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-cyan/30 bg-cyan/10 text-sm font-semibold text-cyan">
              {event.step}
            </div>
            <div className="border-b border-line pb-5 last:border-b-0 last:pb-0">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h3 className="font-medium text-slate-100">{event.title}</h3>
                <SignalBadge status={event.risk} />
              </div>
              <p className="text-sm leading-6 text-slate-400">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
