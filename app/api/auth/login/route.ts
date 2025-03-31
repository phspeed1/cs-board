import { loginUser } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();
    
    if (!id || !password) {
      return NextResponse.json(
        { message: "아이디와 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }
    
    const result = await loginUser(id, password);
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }
    
    // 민감한 정보 제거
    if (result.user) {
      const { password: _, session_id: __, ...safeUserData } = result.user;
      
      return NextResponse.json({
        message: "로그인에 성공했습니다.",
        user: safeUserData,
        success: true
      });
    }
    
    return NextResponse.json({
      message: "로그인에 성공했습니다.",
      success: true
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { message: "로그인 처리 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
} 