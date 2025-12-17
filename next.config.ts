import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const, // <--- AGGIUNGI 'as const' QUI
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https' as const, // <--- E QUI
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);