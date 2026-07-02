// Custom next/image loader for static export under a GitHub Pages basePath.
// Prepends the basePath to local image src so /images/x -> /as.ae/images/x.
const basePath = process.env.NODE_ENV === "production" ? "/as.ae" : "";

export default function imageLoader({ src }: { src: string }): string {
  if (/^https?:\/\//.test(src) || src.startsWith("data:")) return src;
  return `${basePath}${src}`;
}
