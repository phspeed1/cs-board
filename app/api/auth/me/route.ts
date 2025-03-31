import { getCurrentUser } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "로그인되어 있지 않습니다." },
        { status: 401 }
      );
    }
    
    // 민감한 정보 제거
    const { password: _, session_id: __, ...safeUserData } = user;
    
    return NextResponse.json({
      user: safeUserData,
      success: true
    });
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    return NextResponse.json(
      { message: "사용자 정보 조회 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
} 