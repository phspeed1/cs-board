"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IPostWithAuthor, IPaginatedResponse } from "@/types";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/utils/date";

export default function PostList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<IPostWithAuthor[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // URL에서 페이지 번호 가져오기
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  // 게시글 목록 불러오기
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts?page=${pagination.page}&pageSize=${pagination.pageSize}`);
        
        if (!res.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }
        
        const data: IPaginatedResponse<IPostWithAuthor> = await res.json();
        setPosts(data.data);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "게시글 목록을 불러오는데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, [pagination.page, pagination.pageSize]);

  // 로그인 상태 체크
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("로그인 상태 확인 오류:", error);
      }
    }
    
    checkLoginStatus();
  }, []);

  // 페이지 이동 처리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      router.push(`/posts?page=${newPage}`);
    }
  };

  // 게시글 작성 페이지로 이동
  const handleWritePost = () => {
    if (isLoggedIn) {
      router.push("/posts/write");
    } else {
      router.push("/login");
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <Link href="/posts/write">
          <Button className="transition-all hover:translate-y-[-2px]">
            게시글 작성
          </Button>
        </Link>
      </div>

      <Card>
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
                Array(10).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-200 loading">
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                    <td className="py-3 px-4 bg-gray-100 h-12"></td>
                  </tr>
                ))
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr 
                    key={post.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{pagination.total - (pagination.page - 1) * pagination.pageSize - index}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={`/posts/${post.id}`}
                        className="text-[var(--primary)] hover:underline font-medium"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{post.author_nickname}</td>
                    <td className="py-3 px-4 text-[var(--muted-text)] text-sm">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="py-3 px-4">{post.view_count}</td>
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
        
        <CardFooter className="flex justify-center pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="transition-all hover:translate-x-[-2px]"
            >
              처음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="transition-all hover:translate-x-[-2px]"
            >
              이전
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // 현재 페이지를 중심으로 앞뒤로 2개씩 표시
                const pageNumbers = [];
                const startPage = Math.max(1, pagination.page - 2);
                const endPage = Math.min(pagination.totalPages, startPage + 4);
                
                for (let j = startPage; j <= endPage; j++) {
                  pageNumbers.push(j);
                }
                
                return pageNumbers.map(pageNum => (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[40px] ${
                      pagination.page === pageNum 
                        ? "bg-[var(--primary)]" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ));
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="transition-all hover:translate-x-[2px]"
            >
              다음
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="transition-all hover:translate-x-[2px]"
            >
              마지막
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 