/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ["leaflet", "react-leaflet"],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
