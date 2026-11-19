import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives in a folder of the portfolio repo; keep Turbopack scoped to it.
  turbopack: { root: __dirname },
};

export default nextConfig;
