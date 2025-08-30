// next.config.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    reactStrictMode: false,
    eslint: { ignoreDuringBuilds: true },
    output: 'standalone',
    basePath: isProd ? '/eboss-pro-max' : '',
    assetPrefix: isProd ? '/eboss-pro-max' : '',
    images: {
        domains: ['devsec.awfatech.com'],
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: isProd ? '/eboss-pro-max' : '',
    },
};
