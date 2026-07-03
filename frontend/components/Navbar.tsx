import Link from "next/link";
import { Activity, Upload } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-line/80 bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-cyan/15 text-cyan">
            <Activity size={22} />
          </span>
          <span className="text-lg font-semibold tracking-wide">ForenSight</span>
        </Link>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded bg-cyan px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cyan/85"
        >
          <Upload size={17} />
          Analyze Image
        </Link>
      </nav>
    </header>
  );
}
