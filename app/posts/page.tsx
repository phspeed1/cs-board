import { Suspense } from "react";
import PostListClient from "./client";

export default function PostPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}>
      <PostListClient />
    </Suspense>
  );
} 