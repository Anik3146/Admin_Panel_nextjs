/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
      {
        protocol: 'https',
        hostname: 'pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev',
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
      // If you need to support localhost for development, you can add a pattern for it
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**', // Adjust the pathname as needed
      },
    ],
  },
};

export default nextConfig;
