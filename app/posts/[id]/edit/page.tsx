import { db, posts, users } from "@/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import EditPostClient from "./client";

interface EditPostProps {
  params: {
    id: string;
  };
}

export default async function EditPost({ params }: EditPostProps) {
  // 파라미터 비동기 처리
  const { id: postId } = await params;
  const currentUser = await getCurrentUser();

  // 로그인 상태 확인
  if (!currentUser) {
    redirect("/login");
  }

  // 게시글 조회
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
    redirect("/posts");
  }

  const post = postWithAuthor[0];

  // 게시글 작성자와 현재 사용자가 다른 경우 권한 없음
  if (post.author_id !== currentUser.id) {
    redirect("/posts");
  }

  return <EditPostClient post={post} />;
} 