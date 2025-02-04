/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        workerThreads: false,
        cpus: 4
    }
};

export default nextConfig;
