/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  allowedDevOrigins: ["192.168.100.2", "192.168.100.9", "localhost:3000"],
  // Pin the project root; otherwise a package-lock.json in a parent folder confuses Turbopack.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
