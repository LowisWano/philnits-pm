import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  srcDir: 'src',

  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
};

export default nextConfig;
