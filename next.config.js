/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    mongodb_username: "bxdev",
    mongodb_password: "8SWsD238DmU7sL9o",
    mongodb_db: "portefolio",
    NEXTAUTH_URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
