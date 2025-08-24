/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
    output: 'export',
    basePath: '/inventory',
    assetPrefix: '/inventory/',
};

export default nextConfig;
