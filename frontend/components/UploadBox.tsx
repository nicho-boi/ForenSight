"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileImage, Loader2, UploadCloud, X } from "lucide-react";
import { analyzeImage } from "@/lib/api";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadBox() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function selectFile(nextFile?: File) {
    setError(null);
    if (!nextFile) return;
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setError("Use a JPG, JPEG, PNG, or WEBP image.");
      return;
    }
    if (nextFile.size > MAX_BYTES) {
      setError("Image must be 8MB or smaller.");
      return;
    }
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function submit() {
    if (!file) {
      setError("Choose an image before starting analysis.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const report = await analyzeImage(file);
      sessionStorage.setItem("forensight-report", JSON.stringify(report));
      router.push("/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          selectFile(event.dataTransfer.files[0]);
        }}
        className="flex min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-cyan/40 bg-panel/60 p-8 text-center transition hover:border-cyan"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded bg-cyan/10 text-cyan">
          <UploadCloud size={34} />
        </div>
        <h1 className="text-2xl font-semibold">Upload forensic sample</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">Drop an image here or choose a file to generate a lightweight authenticity report.</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">JPG JPEG PNG WEBP / max 8MB</p>
      </div>

      <aside className="rounded-lg border border-line bg-panel/80 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Selected image</h2>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="rounded p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Clear selected image"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Uploaded image preview" className="mb-4 aspect-video w-full rounded object-contain bg-ink" />
        ) : (
          <div className="mb-4 flex aspect-video w-full items-center justify-center rounded bg-ink text-slate-500">
            <FileImage size={42} />
          </div>
        )}
        {file && <p className="mb-4 text-sm text-slate-300">{file.name}</p>}
        {error && <p className="mb-4 rounded border border-danger/40 bg-danger/10 p-3 text-sm text-red-200">{error}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-cyan px-5 py-3 font-semibold text-ink transition hover:bg-cyan/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
          {loading ? "Analyzing indicators" : "Run Analysis"}
        </button>
      </aside>
    </section>
  );
}
