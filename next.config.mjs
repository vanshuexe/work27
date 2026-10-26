/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the project root; otherwise a package-lock.json in a parent folder confuses Turbopack.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
