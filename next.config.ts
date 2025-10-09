import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ wajib untuk static export
  images: {
    unoptimized: true, // ✅ biar next/image tetap jalan di hosting biasa (tanpa server)
  },
  basePath: "/out",
  assetPrefix: "/out/",
};

export default nextConfig;
