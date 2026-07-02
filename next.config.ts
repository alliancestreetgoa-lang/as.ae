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
    unoptimized: true, // GitHub Pages has no Next image optimizer
  },
};

export default nextConfig;
