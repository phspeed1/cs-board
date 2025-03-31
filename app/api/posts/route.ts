import { db, posts, users } from "@/db";
import { getCurrentUser } from "@/utils/auth";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// 게시글 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    
    if (page < 1 || pageSize < 1) {
      return NextResponse.json(
        { message: "잘못된 페이지 정보입니다." },
        { status: 400 }
      );
    }
    
    const offset = (page - 1) * pageSize;
    
    // 게시글 목록 조회 (작성자 닉네임 포함)
    const postsWithAuthor = await db
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
      .orderBy(desc(posts.created_at))
      .limit(pageSize)
      .offset(offset);
    
    // 전체 게시글 수 조회
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts);
      
    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    
    return NextResponse.json({
      data: postsWithAuthor,
      total: totalCount,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    console.error("게시글 목록 조회 오류:", error);
    return NextResponse.json(
      { message: "게시글 목록 조회 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
}

// 게시글 생성
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { message: "제목과 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }
    
    // 게시글 저장 및 삽입된 게시글 정보 반환
    const result = await db.insert(posts)
      .values({
        title,
        content,
        author_id: currentUser.id,
        view_count: 0,
        created_at: new Date(),
      })
      .returning();
    
    // 삽입된 게시글 정보
    const newPost = result[0];
    
    return NextResponse.json(
      { 
        message: "게시글이 작성되었습니다.", 
        success: true,
        post: newPost
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("게시글 작성 오류:", error);
    return NextResponse.json(
      { message: "게시글 작성 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
} 