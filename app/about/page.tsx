import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">소개</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 소개</CardTitle>
            <CardDescription>CS-Board 프로젝트에 대한 소개</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              이 프로젝트는 Next.js와 DrizzleORM을 사용한 간단한 게시판 서비스입니다.
              사용자들은 계정을 만들고, 게시글을 작성하고, 다른 사용자의 게시글을 볼 수 있습니다.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>기술 스택</CardTitle>
            <CardDescription>이 프로젝트에 사용된 기술</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>프레임워크: Next.js 15</li>
              <li>UI 라이브러리: ShadCN UI</li>
              <li>데이터베이스: DrizzleORM</li>
              <li>인증: 자체 구현된 인증 시스템</li>
              <li>스타일링: Tailwind CSS</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>연락처</CardTitle>
            <CardDescription>문의 사항이 있으시면 연락주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              이메일: contact@example.com<br />
              깃허브: <a href="https://github.com/example/cs-board" className="text-primary hover:underline">github.com/example/cs-board</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 