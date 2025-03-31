"use client";

import { IPostWithAuthor } from "@/types";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { EyeIcon, CalendarIcon, UserIcon } from "lucide-react";

export default function PostDetailClient({ post, isAuthor }: { post: IPostWithAuthor; isAuthor: boolean }) {
  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "게시글 삭제에 실패했습니다.");
      }

      window.location.href = "/posts";
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert(error instanceof Error ? error.message : "게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 pb-4 border-b">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap justify-between items-center text-[var(--muted-text)] text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                <span>{post.author_nickname}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <time dateTime={post.created_at.toISOString()}>
                  {formatDate(post.created_at)}
                </time>
              </div>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <EyeIcon className="w-4 h-4 mr-1" />
              <span>조회수 {post.view_count}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-6 min-h-[300px] whitespace-pre-wrap">
          {post.content}
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t">
          <Link href="/posts">
            <Button variant="outline" className="transition-all hover:translate-x-[-2px]">
              목록으로
            </Button>
          </Link>

          {isAuthor && (
            <div className="space-x-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button className="transition-all hover:translate-y-[-2px]">
                  수정
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="transition-all hover:scale-105"
              >
                삭제
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 