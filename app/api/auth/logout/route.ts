import { db, users } from "@/db";
import { logout } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get("userId")?.value;
    
    // 데이터베이스에서 세션 ID 초기화
    if (userId) {
      await db.update(users)
        .set({ session_id: null })
        .where(eq(users.id, userId));
    }
    
    // 쿠키 삭제
    logout();
    
    return NextResponse.json({
      message: "로그아웃 되었습니다.",
      success: true
    });
  } catch (error) {
    console.error("로그아웃 오류:", error);
    return NextResponse.json(
      { message: "로그아웃 처리 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
} 