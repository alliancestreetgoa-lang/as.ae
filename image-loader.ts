// Custom next/image loader for static export (served from the custom
// domain root - no basePath prefix needed).
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  if (/^https?:\/\//.test(src) || src.startsWith("data:")) return src;
  // The `?w=` is what stops Next's "loader does not implement width" warning
  // (each srcset entry now yields a distinct URL). The static export host
  // (GitHub Pages) ignores the query and serves the same file, so nothing is
  // actually resized — these images are unoptimizable static assets.
  return `${src}?w=${width}`;
}
