import { db, users } from "@/db";
import { hashPassword } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

// 회원가입 처리 API
export async function POST(request: NextRequest) {
  try {
    const { id, name, password, confirm_password, phone_number, email, nickname } = await request.json();
    
    // 필수 필드 확인
    if (!id || !name || !password || !confirm_password || !email || !nickname) {
      return NextResponse.json(
        { message: "모든 필수 항목을 입력해주세요." },
        { status: 400 }
      );
    }
    
    // 비밀번호 일치 확인
    if (password !== confirm_password) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }
    
    // 아이디 중복 확인
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id)
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "이미 사용 중인 아이디입니다." },
        { status: 400 }
      );
    }
    
    // 사용자 정보 저장
    const hashedPassword = hashPassword(password);
    
    await db.insert(users).values({
      id,
      name,
      password: hashedPassword,
      phone_number: phone_number || null,
      email,
      nickname,
      last_login_at: null,
      session_id: null
    });
    
    return NextResponse.json(
      { message: "회원가입이 완료되었습니다.", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
} 