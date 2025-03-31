'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function performLogout() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // 로그아웃 성공 시 홈페이지로 리디렉션
          router.push('/');
        } else {
          console.error('로그아웃 실패:', await response.text());
          // 실패해도 홈페이지로 리디렉션
          router.push('/');
        }
      } catch (error) {
        console.error('로그아웃 오류:', error);
        // 오류가 발생해도 홈페이지로 리디렉션
        router.push('/');
      }
    }

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">로그아웃 중...</h1>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
} 