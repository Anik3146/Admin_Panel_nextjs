/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**', // Adjust if needed
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Adjust if needed
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**', // Adjust if needed
      },
      {
        protocol: 'https',
        hostname: 'pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev',
        port: '',
        pathname: '/**', // Adjust if needed
      },
      {
        protocol: 'https',
        hostname: 'www.chanel.com', // Add this line for Chanel
        port: '',
        pathname: '/images/**', // Adjust if you want to restrict the paths
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**', // For local development
      },
    ],
  },
};

export default nextConfig;
