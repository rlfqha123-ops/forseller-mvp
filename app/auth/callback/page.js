"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // 0.8초의 여유를 두고 세션 취득을 대기 (클라이언트 SDK가 OAuth 토큰 파싱을 완료하도록 함)
      setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // 소셜 로그인이 성공하면 기본적으로 자동 로그인 상태를 활성화함
          localStorage.setItem("forSeller_autoLogin", "true");
          router.replace("/");
        } else {
          // 세션 취득이 되지 않았을 경우 로그인 페이지로 리다이렉트
          router.replace("/login");
        }
      }, 800);
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 bg-slate-50 relative overflow-hidden">
      {/* 백그라운드 네온 조명 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm text-center relative z-10 space-y-6">
        {/* 로딩 애니메이션 */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-900 border-t-transparent animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            소셜 로그인 연동 중
          </h2>
          <p className="text-slate-400 text-xs font-light max-w-xs mx-auto leading-relaxed">
            보안 토큰을 확인하고 세션을 연동하는 중입니다. 잠시만 기다려 주세요...
          </p>
        </div>
      </div>
    </div>
  );
}
