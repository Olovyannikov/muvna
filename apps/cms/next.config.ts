import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: 'standalone',
  agentRules: false,
  outputFileTracingRoot: path.resolve(dirname, '../..'),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  turbopack: { root: path.resolve(dirname, '../..') },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
