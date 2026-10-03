import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Next.js 16 specific optimizations
	reactStrictMode: true,
  reactCompiler: true,
	allowedDevOrigins: ['192.168.100.200']
};

export default nextConfig;
