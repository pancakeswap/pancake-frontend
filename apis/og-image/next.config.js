/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  rewrites: async () => {
    return [{ source: '/v1/:template', destination: '/api/v1/:template' }]
  },
}

module.exports = nextConfig
