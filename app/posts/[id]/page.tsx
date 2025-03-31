import { IPostWithAuthor } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db, posts, users } from "@/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import PostDetailClient from "./client";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 서버 컴포넌트
export default async function PostDetail({ params }: PostPageProps) {
  // 파라미터 비동기 처리
  const { id: postId } = await params;
  const currentUser = await getCurrentUser();

  // 게시글 조회 (작성자 닉네임 포함)
  const postWithAuthor = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      author_id: posts.author_id,
      author_nickname: users.nickname,
      view_count: posts.view_count,
      created_at: posts.created_at,
    })
    .from(posts)
    .leftJoin(users, eq(posts.author_id, users.id))
    .where(eq(posts.id, postId))
    .limit(1);

  if (postWithAuthor.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">오류</h1>
        <p>게시글을 찾을 수 없습니다.</p>
        <Link href="/posts">
          <Button variant="outline" className="mt-4">
            목록으로
          </Button>
        </Link>
      </div>
    );
  }

  const post = postWithAuthor[0];
  const isAuthor = currentUser?.id === post.author_id;

  // 조회수 증가
  await db
    .update(posts)
    .set({ view_count: post.view_count + 1 })
    .where(eq(posts.id, postId));

  return <PostDetailClient post={post} isAuthor={isAuthor} />;
} 