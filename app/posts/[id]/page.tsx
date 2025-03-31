"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IPostWithAuthor } from "@/types";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostDetail({ params }: PostPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [post, setPost] = useState<IPostWithAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 게시글 데이터 불러오기
  useEffect(() => {
    async function fetchPostData() {
      try {
        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }

        const postData = await res.json();
        setPost(postData);

        // 현재 로그인한 사용자와 작성자 확인
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const userData = await meRes.json();
          if (userData.user && userData.user.id === postData.author_id) {
            setIsCurrentUserAuthor(true);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "게시글을 불러오는데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostData();
  }, [id]);

  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("게시글 삭제에 실패했습니다.");
      }

      // 삭제 성공 시 목록으로 이동
      router.push("/posts");
    } catch (error) {
      setError(error instanceof Error ? error.message : "게시글 삭제 중 오류가 발생했습니다.");
      setIsDeleting(false);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
        <Button variant="outline" onClick={() => router.push("/posts")}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded mb-4">
          게시글을 찾을 수 없습니다.
        </div>
        <Button variant="outline" onClick={() => router.push("/posts")}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="flex justify-between text-sm text-gray-500 border-b pb-3">
          <div>
            <span>작성자: {post.author_nickname}</span>
            <span className="ml-4">조회수: {post.view_count}</span>
          </div>
          <div>작성일: {formatDate(post.created_at.toString())}</div>
        </div>
      </div>
      
      {/* 게시글 내용 */}
      <div className="mb-8 min-h-[200px]">
        <div className="prose max-w-none whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
      
      {/* 하단 버튼 영역 */}
      <div className="flex justify-between mt-10 border-t pt-4">
        <Button variant="outline" onClick={() => router.push("/posts")}>
          목록
        </Button>
        
        {isCurrentUserAuthor && (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/posts/${id}/edit`)}
            >
              수정
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 