"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser } from "@/types";

interface AuthContextType {
  user: Partial<IUser> | null;
  isLoading: boolean;
  login: (userData: Partial<IUser>) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Partial<IUser> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 인증 상태 확인
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("인증 확인 중 오류:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = (userData: Partial<IUser>) => {
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
  };

  // 초기 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 