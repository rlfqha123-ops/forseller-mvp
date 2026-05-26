"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. 초기 세션 확인
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getInitialSession();

    // 2. 인증 상태 변화 감지 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("forSeller_autoLogin");
      window.location.reload(); // 상태 초기화를 위해 새로고침 처리
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 로고 영역 - Next.js Link와 커서 포인터, 호버 효과 탑재 */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          {/* 세련된 AI 소싱 로고 */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-900 to-indigo-700 flex items-center justify-center text-white font-black text-sm tracking-wider transition-transform duration-200 group-hover:scale-105">
            fS
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight transition-colors duration-200 group-hover:text-blue-900">
            forSeller <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold ml-1">AI</span>
          </span>
        </Link>

        {/* 메뉴 링크 영역 - 로그인 여부에 따른 동적 UI 분기 */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              {/* 유저 정보 텍스트 (모바일에서는 숨김 처리) */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/50 py-1.5 px-3 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-600 font-medium">
                  <strong>{user.email.split("@")[0]}</strong> 님 추천 리포트 매칭 중
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 border border-slate-200/80 shadow-sm cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                로그인
              </Link>
              
              <Link
                href="/signup"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
              >
                파트너 가입하기
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

