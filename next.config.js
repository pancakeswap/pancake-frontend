/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
    ]
  },
}
