"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [user, setUser] = useState<Partial<IUser> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 로그인 상태 확인
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("로그인 상태 확인 오류:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkLoginStatus();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (res.ok) {
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <header className="bg-[var(--primary)] text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CS-Board
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/posts" className="hover:text-gray-300 transition-colors">
            게시판
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            소개
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden md:inline-block">
                {user.nickname}님 환영합니다
              </span>
              <Link href="/logout">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[var(--primary)]">
                  로그아웃
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[var(--primary)]">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-[var(--primary)] hover:bg-gray-100">
                  회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 