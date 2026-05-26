"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUpForm({ onSignUpSuccess }) {
  // 회원가입 입력 필드 상태 관리
  const [username, setUsername] = useState(""); // 이메일로 사용
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // 휴대폰 인증 및 약관동의 상태 관리
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  // 성공 및 실패 상태 관리
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 휴대폰 번호 입력 및 자동 하이픈 포맷팅
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let formatted = "";

    if (value.length <= 3) {
      formatted = value;
    } else if (value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }

    setPhone(formatted);
    setError("");
  };

  // 휴대폰 인증 요청 시뮬레이터 (MVP 테스트 목적 유지)
  const handleRequestVerification = () => {
    if (phone.length < 12) {
      setError("올바른 휴대폰 번호(10~11자리 숫자)를 입력해 주세요.");
      return;
    }
    
    setIsPhoneVerified(true);
    setVerificationMessage("✨ MVP 테스트 기간에는 자동으로 휴대폰 인증이 완료됩니다.");
    setError("");
  };

  // 회원가입 폼 제출 핸들러 - Supabase Auth 연동
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("아이디(이메일)를 입력해 주세요.");
      return;
    }
    // 이메일 형식 정밀 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setError("올바른 이메일 형식(예: seller@forseller.ai)을 입력해 주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    if (!isPhoneVerified) {
      setError("휴대폰 번호 인증을 완료해 주세요.");
      return;
    }
    if (!agreed) {
      setError("이용약관 및 정보 제공 동의가 필요합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase 회원가입 호출
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: username,
        password: password,
        options: {
          data: {
            phone: phone,
            agreed: agreed,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message || "회원가입 중 오류가 발생했습니다.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSuccess(true);
      if (onSignUpSuccess) {
        onSignUpSuccess({ username, phone });
      }
    } catch (err) {
      setError("서버와 통신하는 중 문제가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  // 소셜 가입/로그인 핸들러
  const handleSocialSignUp = async (provider) => {
    setError("");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      setError("소셜 인증 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 성공 시 완료 화면 렌더링
  if (success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 md:p-10 text-center animate-fade-in max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-bounce">
          🤝
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          셀러 가입을 축하합니다!
        </h3>
        <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
          성공적으로 <strong>forSeller AI</strong> 파트너가 되셨습니다.<br />
          입력하신 정보로 실시간 급상승 소싱 리포트 정보가 연동됩니다.
        </p>

        {/* 회원 가입 요약증 */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-6 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">파트너 이메일</span>
            <span className="font-bold text-slate-900">{username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">알림 전송 연락처</span>
            <span className="font-bold text-slate-900">{phone}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 text-emerald-600 font-extrabold">
            <span>회원 등급</span>
            <span>프리미엄 AI 파트너 (무료)</span>
          </div>
        </div>

        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 md:p-10 max-w-lg mx-auto relative overflow-hidden">
      {/* 딥블루 상단 데코 라인 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-900 to-indigo-700" />

      <div className="text-center mb-8">
        <span className="text-blue-600 text-xs font-black tracking-wider bg-blue-50 px-3 py-1.5 rounded-full inline-block mb-3">
          SELLER REGISTER
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI 파트너 셀러 가입하기
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2.5 font-light">
          가입 시 매일 아침 도매가 및 실시간 언급량 분석 리포트 수신 대상에 포함됩니다.
        </p>
      </div>

      {/* 에러 메시지 알럿 */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl mb-6 flex items-center gap-1.5 animate-pulse">
          <span>⚠️</span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* 가입 폼 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 아이디(이메일) 입력 */}
        <div>
          <label htmlFor="username-signup" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
            아이디 (이메일) <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="username-signup"
            type="email"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="example@forseller.ai"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password-signup" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
            비밀번호 <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="6자리 이상 비밀번호를 입력해주세요"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
          />
        </div>

        {/* 비밀번호 확인 입력 */}
        <div>
          <label htmlFor="confirm-signup" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
            비밀번호 확인 <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="confirm-signup"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            placeholder="비밀번호를 한번 더 입력해주세요"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
          />
        </div>

        {/* 휴대폰 번호 입력 및 인증버튼 */}
        <div>
          <label htmlFor="phone-signup" className="block text-slate-700 text-xs font-extrabold mb-1.5 tracking-wide">
            휴대폰 번호 <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="phone-signup"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              onClick={handleRequestVerification}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 rounded-xl transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              인증요청
            </button>
          </div>
          
          {/* 인증요청 성공 알림 텍스트 */}
          {verificationMessage && (
            <p className="text-[11px] text-blue-600 font-medium mt-1.5 bg-blue-50/50 border border-blue-100 p-2 rounded-lg animate-fade-in">
              {verificationMessage}
            </p>
          )}
        </div>

        {/* 이용약관 요약박스 및 전체동의 체크박스 */}
        <div className="space-y-3 pt-2">
          <label className="block text-slate-700 text-xs font-extrabold tracking-wide">
            이용약관 및 정보 제공 동의 <span className="text-rose-500 font-bold">*</span>
          </label>
          
          {/* 스크롤 가능한 약관 요약 박스 */}
          <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-3 h-24 overflow-y-auto text-[11px] text-slate-500 leading-relaxed font-light scrollbar-thin">
            <div className="space-y-2">
              <p><strong>[목적]</strong> AI 소싱 추천 카카오톡 리포트 발송 및 파트너 회원 식별 관리</p>
              <p><strong>[항목]</strong> 이메일 아이디, 비밀번호, 휴대폰 번호</p>
              <p><strong>[기간]</strong> 회원 탈퇴 시 또는 서비스 공식 종료 시까지 보유 및 이용</p>
              <p><strong>[면책조항]</strong> 본 서비스에서 제공하는 도매 단가, 트렌드 분석 언급량, 예상 마진율 등 모든 데이터 정보는 외부 데이터를 기반으로 한 참고용 지표입니다. 실제 사입 및 마케팅 투자 결과에 대한 최종 법적 책임은 사용자 본인에게 있습니다.</p>
            </div>
          </div>

          {/* 전체동의 체크박스 */}
          <label htmlFor="agree-checkbox" className="flex items-center gap-2.5 cursor-pointer py-1 select-none">
            <input
              id="agree-checkbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700 font-extrabold">이용약관 내용을 확인하였으며, 전체 동의합니다.</span>
          </label>
        </div>

        {/* 회원가입 완료 버튼 */}
        <div className="pt-1">
          <button
            id="signup-complete-btn"
            type="submit"
            disabled={isSubmitting || !agreed}
            className={`w-full font-black text-xs md:text-sm py-4 rounded-xl shadow-lg transition-all duration-300 transform ${
              agreed 
                ? "bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5 cursor-pointer" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                가입 정보를 전송하는 중...
              </>
            ) : (
              "회원가입 완료"
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
          <span className="bg-white px-3 text-slate-400 font-medium">또는 소셜 계정으로 가입</span>
        </div>
      </div>

      {/* 소셜 로그인 버튼 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 구글 가입 버튼 */}
        <button
          type="button"
          onClick={() => handleSocialSignUp("google")}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
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
          Google
        </button>

        {/* 카카오 가입 버튼 */}
        <button
          type="button"
          onClick={() => handleSocialSignUp("kakao")}
          className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] text-xs font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 3.18-9 7.1 0 2.53 1.7 4.75 4.27 5.9l-.86 3.16c-.1.35.12.72.48.8.1.02.2.02.28 0l3.72-2.48c.37.05.74.08 1.13.08 4.97 0 9-3.18 9-7.1S16.97 3 12 3z" />
          </svg>
          Kakao
        </button>
      </div>
    </div>
  );
}
