export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">CS-Board</h2>
            <p className="text-sm text-gray-300">
              안전하고 편리한 회원제 게시판 시스템에 오신 것을 환영합니다.
            </p>
          </div>
          
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} CS-Board. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 