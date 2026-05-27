"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  // 로그인 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  // 로딩 및 알림 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 컴포넌트 마운트 시 저장된 설정 불러오기
  useEffect(() => {
    // 1. 아이디(이메일) 기억 불러오기
    const savedEmail = localStorage.getItem("forSeller_rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberId(true);
    }

    // 2. 자동 로그인 설정 불러오기
    const savedAutoLogin = localStorage.getItem("forSeller_autoLogin") === "true";
    if (savedAutoLogin) {
      setAutoLogin(true);
    }

    // 이미 활성 세션이 존재하고 자동 로그인이 켜져 있다면 셀러 대시보드로 리다이렉트
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && savedAutoLogin) {
        setSuccess(true);
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  // 로그인 폼 제출 핸들러 - Supabase Auth 연동
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("아이디(이메일)를 입력해 주세요.");
      return;
    }
    // 간단한 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식(예: seller@forseller.ai)을 입력해 주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
        setIsSubmitting(false);
        return;
      }

      // 아이디 기억 처리
      if (rememberId) {
        localStorage.setItem("forSeller_rememberedEmail", email);
      } else {
        localStorage.removeItem("forSeller_rememberedEmail");
      }

      // 자동 로그인 설정 처리
      if (autoLogin) {
        localStorage.setItem("forSeller_autoLogin", "true");
      } else {
        localStorage.removeItem("forSeller_autoLogin");
      }

      setIsSubmitting(false);
      setSuccess(true);

      // 성공 모달 노출 후 셀러 소싱 대시보드('/dashboard')로 즉시 라우팅 이동
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setError("서버와 통신하는 중 문제가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  // 소셜 로그인 핸들러
  const handleSocialLogin = async (provider) => {
    setError("");
    try {
      // 소셜 로그인 시에도 자동 로그인 상태가 켜져 있다면 설정을 기억하게 함
      if (autoLogin) {
        localStorage.setItem("forSeller_autoLogin", "true");
      } else {
        localStorage.removeItem("forSeller_autoLogin");
      }

      const oauthOptions = {
        redirectTo: "https://forseller-mvp.vercel.app/auth/callback",
      };

      // 카카오 앱이 개인 개발자용이라 이메일 권한이 없을 경우를 대비해, 
      // scopes와 queryParams.scope를 통해 카카오와 수파베이스에 전달되는 scope 파라미터에서 account_email을 물리적으로 완전히 제외하고 강제 오버라이드합니다.
      if (provider === "kakao") {
        oauthOptions.scopes = "profile";
        oauthOptions.queryParams = {
          scope: "profile",
        };
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: oauthOptions,
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      setError("소셜 로그인 인증에 실패했습니다.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6 bg-slate-50 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* 딥블루 은은한 배경 데코 광원 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* 로그인 박스 컨테이너 */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 md:p-10 relative overflow-hidden z-10 animate-fade-in">
        {/* 상단 딥블루 라인 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 to-indigo-700" />

        {/* 상단 제목 헤더 */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-700 flex items-center justify-center text-white font-black text-base mx-auto mb-4 tracking-wider">
            fS
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            파트너 셀러 로그인
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2.5 font-light">
            AI 소싱 추천 대시보드와 카톡 리포트를 관리하세요.
          </p>
        </div>

        {/* 에러 상태 뱃지 */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl mb-6 flex items-center gap-1.5 animate-pulse">
            <span>⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* 로그인 성공 팝업/모달 효과 */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-4 rounded-xl mb-6 text-center animate-fade-in font-extrabold">
            🎉 로그인 성공! 잠시 후 셀러 대시보드로 이동합니다.
          </div>
        )}

        {/* 로그인 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 아이디(이메일) 입력 */}
          <div>
            <label htmlFor="email-login" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
              아이디 (이메일) <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="email-login"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="example@forseller.ai"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
              disabled={isSubmitting || success}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password-login" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
              비밀번호 <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="비밀번호를 입력해 주세요"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
              disabled={isSubmitting || success}
            />
          </div>

          {/* 체크박스 영역 (아이디 저장 & 자동 로그인) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1 select-none">
            {/* 아이디 저장 체크 */}
            <label htmlFor="remember-checkbox" className="flex items-center gap-2 cursor-pointer">
              <input
                id="remember-checkbox"
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                disabled={isSubmitting || success}
              />
              <span className="text-xs text-slate-600 font-bold">아이디 저장</span>
            </label>

            {/* 자동 로그인 체크 */}
            <label htmlFor="autologin-checkbox" className="flex items-center gap-2 cursor-pointer">
              <input
                id="autologin-checkbox"
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                disabled={isSubmitting || success}
              />
              <span className="text-xs text-slate-600 font-bold">자동 로그인</span>
            </label>
          </div>

          {/* 로그인 실행 버튼 */}
          <div className="pt-1">
            <button
              id="login-btn"
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs md:text-sm py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  로그인 세션 확인 중...
                </>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-4 text-slate-400 font-bold tracking-wide">1초 간편 소셜 로그인</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 리스트 (풀 와이드 세로 배치) */}
        <div className="flex flex-col gap-3">
          {/* 카카오톡 로그인 버튼 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("kakao")}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FEE500]/95 text-[#191919] text-xs md:text-sm font-black py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4 text-[#191919]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-4.97 0-9 3.18-9 7.1 0 2.53 1.7 4.75 4.27 5.9l-.86 3.16c-.1.35.12.72.48.8.1.02.2.02.28 0l3.72-2.48c.37.05.74.08 1.13.08 4.97 0 9-3.18 9-7.1S16.97 3 12 3z" />
            </svg>
            카카오톡으로 시작하기
          </button>

          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.58 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.5l3.85 3C6.16 7.6 8.87 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.47h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.65 2.83c2.13-1.97 3.75-4.87 3.75-8.51z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.39 7.5C.5 9.3 0 11.3 0 13.5s.5 4.2 1.39 6l3.85-3z"
              />
              <path
                fill="#34A853"
                d="M12 22.96c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.31 1.09-4.31 1.09-3.13 0-5.84-2.56-6.76-5.46l-3.85 3c1.98 3.85 5.96 6.5 10.61 6.5z"
              />
            </svg>
            Google로 시작하기
          </button>
        </div>

        {/* 하단 링크 보조 영역 */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center flex justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <Link href="/signup" className="hover:text-blue-900 transition-colors">
            파트너 회원가입
          </Link>
          <span>|</span>
          <span className="cursor-not-allowed hover:text-slate-400 transition-colors">
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
}

