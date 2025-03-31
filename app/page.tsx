import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          CS-Board 회원제 게시판
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          안전하고 편리한 회원제 게시판 시스템에 오신 것을 환영합니다.
          <br />다양한 주제에 대해 의견을 나누고 소통해보세요.
        </p>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/posts">
            <Button className="px-6 py-5 text-base font-semibold">
              게시판 보기
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="px-6 py-5 text-base font-semibold">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">커뮤니티 참여</h3>
          <p className="text-gray-600">
            다양한 사용자들과 소통하고 정보를 공유하세요. 함께 성장하는 커뮤니티가 되었으면 합니다.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">안전한 계정 관리</h3>
          <p className="text-gray-600">
            사용자 정보는 안전하게 보호됩니다. 개인정보 보호에 최선을 다하고 있습니다.
          </p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-xl font-semibold mb-3">모바일 환경 지원</h3>
          <p className="text-gray-600">
            모바일 환경에서도 편리하게 사용할 수 있는 반응형 디자인을 적용하였습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
