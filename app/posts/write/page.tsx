import { getCurrentUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import WritePostClient from "./client";

export default async function WritePage() {
  const currentUser = await getCurrentUser();

  // 로그인 상태 확인
  if (!currentUser) {
    redirect("/login");
  }

  return <WritePostClient />;
} 