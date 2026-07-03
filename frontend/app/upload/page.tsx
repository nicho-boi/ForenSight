import { UploadBox } from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan">Forensic intake</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Analyze Image</h1>
      </div>
      <UploadBox />
    </main>
  );
}
