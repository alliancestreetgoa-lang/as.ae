import type { NextConfig } from "next";

// Deployed to GitHub Pages as a project site at /as.ae.
// For a custom domain (e.g. as.ae), set basePath/assetPrefix to "" instead.
const repo = "as.ae";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export", // static HTML export -> out/
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true, // so /banking resolves to /banking/index.html on Pages
  images: {
    // Custom loader prepends basePath to image src (unoptimized images don't
    // get basePath automatically, which 404s them under /as.ae on Pages).
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;
