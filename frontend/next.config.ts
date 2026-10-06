import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Next.js 16 specific optimizations
	reactStrictMode: true,
  reactCompiler: true,
	allowedDevOrigins: ['192.168.100.200'],
	// frontend/ lives inside the backend repo; pin the root so Turbopack ignores the backend's lockfile
	turbopack: { root: path.resolve(__dirname) },
	// Proxy API calls to the Express backend so the browser stays same-origin (session cookies, no CORS)
	async rewrites() {
		const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";
		return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
	},
};

export default nextConfig;
