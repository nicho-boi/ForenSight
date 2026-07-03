import Link from "next/link";
import { ArrowRight, BrainCircuit, Fingerprint, ScanSearch, type LucideIcon } from "lucide-react";

const signalCards: Array<{ title: string; copy: string; Icon: LucideIcon }> = [
  { title: "Metadata trace", copy: "EXIF presence, export software, dimensions", Icon: Fingerprint },
  { title: "ELA preview", copy: "Estimated recompression differences", Icon: ScanSearch },
  { title: "Heuristic likelihood", copy: "Combined probable indicators with careful wording", Icon: BrainCircuit }
];

export default function Home() {
  return (
    <main className="grid-overlay min-h-[calc(100vh-73px)]">
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-cyan">Image Forensics Dashboard</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white md:text-6xl">ForenSight</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">Analyze image authenticity through lightweight forensic signals.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/upload" className="inline-flex items-center gap-2 rounded bg-cyan px-6 py-3 font-semibold text-ink transition hover:bg-cyan/85">
              Analyze Image
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-panel/85 p-5 shadow-forensic">
          <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm text-slate-400">Live report model</p>
              <h2 className="text-xl font-semibold">Forensic Signals</h2>
            </div>
            <span className="rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Baseline</span>
          </div>
          <div className="space-y-4">
            {signalCards.map(({ title, copy, Icon }) => (
              <div key={title} className="flex gap-4 rounded border border-line bg-ink/55 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded bg-cyan/10 text-cyan">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-100">{title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
