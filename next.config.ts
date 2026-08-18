import type { NextConfig } from "next";

/** Where the API lives when the portal is reached directly, bypassing nginx. */
const API_ORIGIN = process.env.CLUBS_API_BASE_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * The browser always calls /api/clubs on its own origin, so nothing about the
   * API's host is baked into the client bundle.
   *
   * Behind nginx this never runs: nginx matches ^/(api|auth)/ first and proxies
   * straight to the API. It only takes effect when the portal is opened on its
   * own port in development, where nginx is not in front of it.
   */
  async rewrites() {
    return [
      { source: "/api/clubs", destination: `${API_ORIGIN}/api/clubs` },
      { source: "/api/clubs/:path*", destination: `${API_ORIGIN}/api/clubs/:path*` }
    ];
  }
};

export default nextConfig;
