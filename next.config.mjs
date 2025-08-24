/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
    output: 'export',
    basePath: process.env.PAGES_BASE_PATH,
};

export default nextConfig;
