"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IPostWithAuthor } from "@/types";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditPost({ params }: EditPageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 게시글 데이터 불러오기
  useEffect(() => {
    async function fetchPostData() {
      try {
        // 게시글 데이터 가져오기
        const res = await fetch(`/api/posts/${id}`);
        
        if (!res.ok) {
          throw new Error("게시글을 불러오는데 실패했습니다.");
        }
        
        const postData: IPostWithAuthor = await res.json();
        setFormData({
          title: postData.title,
          content: postData.content,
        });
        
        // 현재 로그인한 사용자 정보 가져오기
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        
        const userData = await meRes.json();
        
        // 작성자가 아닌 경우 접근 제한
        if (userData.user?.id !== postData.author_id) {
          router.push(`/posts/${id}`);
          return;
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "게시글을 불러오는데 문제가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPostData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "게시글 수정에 실패했습니다.");
      }

      // 성공 시 상세 페이지로 이동
      router.push(`/posts/${id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/posts/${id}`)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </div>
  );
} 