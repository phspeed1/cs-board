import { SHA512 } from "crypto-js";
import { cookies } from "next/headers";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// 비밀번호 해싱 함수
export function hashPassword(password: string): string {
  return SHA512(password).toString();
}

// 사용자 로그인 처리
export async function loginUser(userId: string, password: string) {
  const hashedPassword = hashPassword(password);
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user || user.password !== hashedPassword) {
    return { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }
  
  // 세션 ID 생성 및 저장
  const sessionId = randomUUID();
  await db.update(users)
    .set({ 
      last_login_at: new Date(),
      session_id: sessionId
    })
    .where(eq(users.id, userId));
  
  // 쿠키에 사용자 정보 저장
  const cookieStore = await cookies();
  cookieStore.set({
    name: "userId",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: "/"
  });
  
  cookieStore.set({
    name: "sessionId",
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: "/"
  });
  
  return { success: true, user };
}

// 현재 로그인된 사용자 확인
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const sessionId = cookieStore.get("sessionId")?.value;
  
  if (!userId || !sessionId) {
    return null;
  }
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user || user.session_id !== sessionId) {
    return null;
  }
  
  return user;
}

// 로그아웃 처리
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  cookieStore.delete("sessionId");
} 