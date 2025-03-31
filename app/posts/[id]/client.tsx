"use client";

import { IPostWithAuthor } from "@/types";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between items-center text-gray-600 mb-4">
          <div>
            <span>작성자: {post.author_nickname}</span>
            <span className="mx-4">|</span>
            <time dateTime={post.created_at.toISOString()}>
              {formatDate(post.created_at)}
            </time>
          </div>
          <div>조회수: {post.view_count}</div>
        </div>
      </div>

      <div className="prose max-w-none mb-8 min-h-[200px]">
        {post.content}
      </div>

      <div className="flex justify-between items-center">
        <Link href="/posts">
          <Button variant="outline">목록으로</Button>
        </Link>

        {isAuthor && (
          <div className="space-x-2">
            <Link href={`/posts/${post.id}/edit`}>
              <Button variant="outline">수정</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 