import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts' // Percorso al file creato nello step 3
);

const nextConfig: NextConfig = {
  /* le tue altre config qui se ne hai */
};

export default withNextIntl(nextConfig);