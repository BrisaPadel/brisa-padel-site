import type { NextConfig } from "next";

/** Where the API lives when the portal is reached directly, bypassing nginx. */
const API_ORIGIN =
  process.env.CLUBS_API_BASE_URL ??
  (process.env.NODE_ENV === "production"
    ? "http://brisa_server:8000"
    : "http://localhost:8000");

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
      { source: "/api/clubs/:path*", destination: `${API_ORIGIN}/api/clubs/:path*` },
      // Reviewing requires a signed-in member, so the sign-in step needs the
      // same treatment as the club calls: same-origin here, nginx in front.
      { source: "/api/auth/:path*", destination: `${API_ORIGIN}/api/auth/:path*` }
    ];
  }
};

export default nextConfig;
