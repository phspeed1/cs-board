/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 경고를 무시하도록 설정
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 