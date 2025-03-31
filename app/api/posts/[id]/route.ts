import { db, posts, users } from "@/db";
import { getCurrentUser } from "@/utils/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// 특정 게시글 조회
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 파라미터 비동기 처리
    const { id: postId } = await context.params;
    
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
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    
    // 조회수 증가
    await db.update(posts)
      .set({ view_count: postWithAuthor[0].view_count + 1 })
      .where(eq(posts.id, postId));
    
    return NextResponse.json({ post: postWithAuthor[0] });
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "게시글 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 게시글 수정
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 파라미터 비동기 처리
    const { id: postId } = await context.params;
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    
    // 게시글 존재 및 소유권 확인
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    
    if (existingPost.author_id !== currentUser.id) {
      return NextResponse.json(
        { error: "게시글을 수정할 권한이 없습니다." },
        { status: 403 }
      );
    }
    
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }
    
    // 게시글 업데이트
    await db.update(posts)
      .set({ title, content })
      .where(eq(posts.id, postId));
    
    return NextResponse.json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 게시글 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 파라미터 비동기 처리
    const { id: postId } = await context.params;
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 게시글 조회
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (post[0].author_id !== currentUser.id) {
      return NextResponse.json(
        { error: "게시글을 삭제할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 게시글 삭제
    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 파라미터 비동기 처리
    const { id: postId } = await context.params;
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    // 게시글 조회
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 작성자 확인
    if (post[0].author_id !== currentUser.id) {
      return NextResponse.json(
        { error: "게시글을 수정할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 게시글 수정
    await db
      .update(posts)
      .set({ title, content })
      .where(eq(posts.id, postId));

    return NextResponse.json({ message: "게시글이 수정되었습니다." });
  } catch (error) {
    console.error("게시글 수정 중 오류 발생:", error);
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 }
    );
  }
} 