export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CS-Board. 모든 권리 보유.
          </p>
          <p className="text-center text-xs mt-1 text-gray-400">
            이 사이트는 Next.js로 개발되었습니다.
          </p>
        </div>
      </div>
    </footer>
  );
} 