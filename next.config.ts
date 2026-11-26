import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.CIUNAC_NEXT_DIST_DIR || ".next",
  typescript: { tsconfigPath: process.env.CIUNAC_NEXT_TSCONFIG || "tsconfig.json" },
  ...(process.env.CIUNAC_DOCKER_STANDALONE === "1" && { output: "standalone" }),
  ...(process.env.CIUNAC_DOCKER_DEV === "1" && { watchOptions: { pollIntervalMs: 1000 } }),
  async headers() {
    return [{
      source: "/estudiantes/:path*",
      headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
    }];
  },
};

export default nextConfig;
