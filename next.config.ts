import type { NextConfig } from "next";
import { readFileSync } from "fs";

const appVersion: string = JSON.parse(readFileSync("./package.json", "utf-8")).version;

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  env: { NEXT_PUBLIC_APP_VERSION: appVersion },
  poweredByHeader: false,
  // Faqat Docker build'da (Vercel o'zi hal qiladi)
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
