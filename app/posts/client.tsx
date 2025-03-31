"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { formatDate } from "@/utils/date";

// 페이지네이션 타입 정의
interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 게시글 타입 정의
interface IPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  view_count: number;
  created_at: Date;
}

// API 응답에서 사용되는 게시글 타입 정의 (날짜가 문자열 형태)
interface IPostResponse {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  view_count: number;
  created_at: string; // API에서는 문자열로 반환됨
}

// 클라이언트 컴포넌트
function PostListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // URL에서 페이지 번호 가져오기
  useEffect(() => {
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  // 게시글 목록 불러오기
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/posts?page=${pagination.page}&limit=${pagination.limit}`);

        if (!res.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }

        const response = await res.json();
        // console.log("API 응답 데이터:", response);
        
        // 데이터 구조 확인 및 안전한 할당 (data.posts 대신 data.data 사용)
        if (response && response.data) {
          // console.log("게시글 데이터:", response.data);
          
          // 날짜 형식 변환을 추가하여 Date 객체로 변환
          const formattedPosts = response.data.map((post: IPostResponse) => ({
            ...post,
            created_at: post.created_at ? new Date(post.created_at) : new Date()
          }));
          
          setPosts(formattedPosts);
          setPagination(prev => ({
            ...prev,
            total: Number(response.total) || 0,
            totalPages: Number(response.totalPages) || 1,
          }));
        } else {
          setPosts([]);
          setError("게시글 데이터 형식이 올바르지 않습니다.");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "게시글을 불러오는데 문제가 발생했습니다.");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [pagination.page, pagination.limit]);

  // 페이지 이동 처리
  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    router.push(`/posts?page=${page}`);
  };

  // 게시글 번호 계산
  const calculatePostNumber = (index: number) => {
    return pagination.total - (pagination.page - 1) * pagination.limit - index;
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <Link href="/posts/write">
          <Button variant="outline" className="transition-all hover:translate-y-[-2px]">
            게시글 작성
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-[var(--card-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--primary)] text-white">
                <th className="py-3 px-4 text-left w-16">번호</th>
                <th className="py-3 px-4 text-left">제목</th>
                <th className="py-3 px-4 text-left w-32">작성자</th>
                <th className="py-3 px-4 text-left w-40">작성일</th>
                <th className="py-3 px-4 text-left w-24">조회수</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(10).fill(0).map((_, index) => (
                  <tr key={index} className="border-b border-gray-200 loading">
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                  </tr>
                ))
              ) : posts && Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr 
                    key={post?.id || index} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{calculatePostNumber(index)}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={`/posts/${post?.id || ''}`}
                        className="text-[var(--primary)] hover:underline font-medium"
                      >
                        {post?.title || '제목 없음'}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{post?.author_nickname || '알 수 없음'}</td>
                    <td className="py-3 px-4 text-[var(--muted-text)] text-sm">
                      {post?.created_at ? formatDate(post.created_at) : '-'}
                    </td>
                    <td className="py-3 px-4">{post?.view_count || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[var(--muted-text)]">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-center pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(1)}
              disabled={pagination.page === 1}
              className="transition-all hover:translate-x-[-2px] text-[var(--foreground)]"
            >
              처음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="transition-all hover:translate-x-[-2px] text-[var(--foreground)]"
            >
              이전
            </Button>
            
            <div className="flex space-x-1">
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={`min-w-[40px] ${
                    pagination.page === pageNum 
                      ? "bg-[var(--primary)] text-gray-400" 
                      : "text-[var(--foreground)] bg-white hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="transition-all hover:translate-x-[2px] text-[var(--foreground)]"
            >
              다음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => goToPage(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="transition-all hover:translate-x-[2px] text-[var(--foreground)]"
            >
              마지막
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense로 감싼 컴포넌트를 export
export default function PostListWithSuspense() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PostListClient />
    </Suspense>
  );
} 