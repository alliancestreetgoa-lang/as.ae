import type { NextConfig } from "next";

// Deployed to GitHub Pages under the custom domain shaukinsv.com (served at
// the domain root via the public/CNAME file - no basePath/assetPrefix needed).
const nextConfig: NextConfig = {
  output: "export", // static HTML export -> out/
  trailingSlash: true, // so /banking resolves to /banking/index.html on Pages
  images: {
    // Static export can't use Next's image optimizer; this loader just
    // appends a width hint so srcset entries get distinct URLs.
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;
