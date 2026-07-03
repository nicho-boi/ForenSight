type ImagePreviewProps = {
  src: string;
  label: string;
};

export function ImagePreview({ src, label }: ImagePreviewProps) {
  return (
    <figure className="rounded-lg border border-line bg-panel/80 p-4">
      <div className="aspect-video overflow-hidden rounded bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="h-full w-full object-contain" />
      </div>
      <figcaption className="mt-3 text-sm font-medium text-slate-300">{label}</figcaption>
    </figure>
  );
}
