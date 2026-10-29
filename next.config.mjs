/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // Pin the project root; otherwise a package-lock.json in a parent folder confuses Turbopack.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
