"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IPostWithAuthor } from "@/types";

interface EditPostClientProps {
  post: IPostWithAuthor;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "게시글 수정에 실패했습니다.");
      }

      router.push(`/posts/${post.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            취소
          </Button>
          <Button type="submit" variant="bordered" disabled={isSubmitting} className="hover:translate-y-[-2px] transition-all">
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </div>
  );
} 