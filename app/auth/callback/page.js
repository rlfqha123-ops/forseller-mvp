"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Supabase JS 클라이언트가 URL 해시(#access_token) 또는 쿼리에서 세션을 자동 파싱합니다.
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        // 대시보드가 읽어들이는 로컬스토리지 로그인 세션 양식을 완벽히 설정합니다.
        localStorage.setItem("forSeller_loginSession", JSON.stringify({
          email: session.user.email || session.user.user_metadata.email || "kakao-partner",
          access_token: session.access_token
        }));
        
        // 세션 보존 상태를 갱신한 뒤 대시보드로 즉시 전환합니다.
        router.push("/dashboard");
      } else {
        console.error("OAuth callback session error:", error);
        router.push("/login?error=oauth-callback-failed");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 text-sm font-semibold">소셜 로그인 세션을 확인하는 중입니다...</p>
      </div>
    </div>
  );
}
