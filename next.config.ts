import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';

const nextConfig: NextConfig = {
  // Extensions de page incluant JS, TS et MDX
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Configuration des images si besoin de remotePatterns
  images: {
    remotePatterns: [
      // { protocol: 'https', hostname: 'exemple.com', port: '', pathname: '/chemin/**' },
    ],
  },
  // Expérimental pour MDX sur Rust
  experimental: {
    mdxRs: true,
  },
  // Package à transpiler (MDX remote)
  transpilePackages: ['next-mdx-remote'],
  // Options Sass
  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },
};

// Intégration de MDX avec remark-gfm
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
