"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  // 로그인 파트너명 상태 관리
  const [partnerName, setPartnerName] = useState("rlfqha123-ops");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 알림톡 모의 발송 시스템 상태 관리
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 로컬스토리지에서 로그인 세션 복구 및 동적 반영
  useEffect(() => {
    try {
      const session = localStorage.getItem("forSeller_loginSession");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.email) {
          // 이메일 골뱅이 앞자리를 파트너 아이디로 세련되게 추출
          const emailPrefix = parsed.email.split("@")[0];
          setPartnerName(emailPrefix);
        }
      } else {
        // 예약 폼에서 남긴 이름이 있다면 그것으로 복구 (모의 체험성 지원)
        const reservations = localStorage.getItem("forSeller_reservations");
        if (reservations) {
          const parsedRes = JSON.parse(reservations);
          if (parsedRes.length > 0) {
            setPartnerName(parsedRes[parsedRes.length - 1].name);
          }
        }
      }
    } catch (e) {
      console.warn("로컬 세션 복구 실패, 기본 파트너명으로 대체합니다.");
    }
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("forSeller_loginSession");
    router.push("/");
  };

  // 추천 상품 가상 데이터 TOP 3
  const sourcingProducts = [
    {
      id: 1,
      badge: "트렌드 급증",
      category: "아웃도어/레저",
      title: "캠핑용 감성 충전식 미니 랜턴",
      emoji: "🔦",
      wholesalePrice: 4500,
      retailPrice: 16900,
      marginRate: 42,
      netProfit: 7100,
      growth: "+240%",
      aiOpinion: "감성 캠핑 릴스/쇼츠 언급 속도 1위. 도매 사입 리스크가 제로에 가깝고 마진 40% 방어가 수월함.",
    },
    {
      id: 2,
      badge: "소셜 언급 대란",
      category: "생활/디지털",
      title: "핸디형 2-in-1 무선 미니 진공 청소기",
      emoji: "🧹",
      wholesalePrice: 12000,
      retailPrice: 29800,
      marginRate: 45,
      netProfit: 13400,
      growth: "+150%",
      aiOpinion: "자취생 1인 가구 타겟팅 가성비 숏폼 홍보 유행. 위탁 공급 채널 안정성 최상급.",
    },
    {
      id: 3,
      badge: "시즌 얼리버드",
      category: "생활/인테리어",
      title: "원룸 무소음 미니 제습기 (USB형)",
      emoji: "💧",
      wholesalePrice: 15900,
      retailPrice: 39900,
      marginRate: 48,
      netProfit: 19100,
      growth: "+180%",
      aiOpinion: "기상청 장마 통계 매칭 지표 급증. 6월 초입에 노출수 극대화 예상되는 황금 마진 상품.",
    },
  ];

  // 실시간 급상승 키워드 TOP 5
  const trendingKeywords = [
    { rank: 1, keyword: "감성 미니 랜턴", score: 240, type: "급증" },
    { rank: 2, keyword: "장마철 미니 제습기", score: 180, type: "상승" },
    { rank: 3, keyword: "무선 핸디 청소기", score: 150, type: "상승" },
    { rank: 4, keyword: "감성 릴스 캠핑의자", score: 120, type: "일반" },
    { rank: 5, keyword: "휴대용 탁상 선풍기", score: 95, type: "일반" },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-screen selection:bg-orange-500 selection:text-white">
      {/* 1. 데스크톱용 좌측 사이드바 (Sidebar Layout - PC) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0b192c] text-white p-6 border-r border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm tracking-wider">
            fS
          </div>
          <span className="font-bold text-lg text-white tracking-tight">forSeller AI</span>
        </div>

        {/* 파트너 웰컴 뱃지 정보 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
            PREMIUM PARTNER
          </span>
          <div className="font-extrabold text-sm text-slate-100 truncate">
            {partnerName} 사장님
          </div>
          <span className="text-[11px] text-slate-400 font-light mt-1 block">등급: 무료 체험 파트너</span>
        </div>

        {/* 사이드 네비게이션 메뉴 */}
        <nav className="flex-1 space-y-2 text-xs">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 bg-blue-600/90 text-white font-extrabold px-4 py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <span>🏠</span>
            <span className="text-[13px]">홈 (대시보드)</span>
          </Link>
          
          <span className="flex items-center gap-3 text-slate-400 hover:text-slate-200 font-bold px-4 py-3.5 rounded-xl transition-colors cursor-not-allowed">
            <span>📊</span>
            <span className="text-[13px]">추천 리포트 내역</span>
          </span>

          <span className="flex items-center gap-3 text-slate-400 hover:text-slate-200 font-bold px-4 py-3.5 rounded-xl transition-colors cursor-not-allowed">
            <span>👤</span>
            <span className="text-[13px]">마이페이지</span>
          </span>
        </nav>

        {/* 사이드바 하단 로그아웃 */}
        <div className="pt-6 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-rose-400 hover:text-rose-300 font-black px-4 py-3 rounded-xl transition-colors text-[13px] text-left cursor-pointer"
          >
            <span>🚪</span>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 2. 모바일 전용 상단 헤더 바 (Header Layout - Mobile) */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0b192c] text-white px-4 h-16 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs">
            fS
          </div>
          <span className="font-bold text-sm text-white tracking-tight">forSeller AI</span>
        </div>
        
        {/* 모바일 햄버거 토글 버튼 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-200"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* 모바일 드롭다운 메뉴 오픈 시 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1f35] text-white p-4 border-b border-slate-800 space-y-2 text-xs animate-fade-in relative z-30">
          <div className="border-b border-slate-800 pb-3 mb-2 flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs">👤 {partnerName} 사장님</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block bg-blue-600/90 text-white font-extrabold px-4 py-3 rounded-xl transition-all cursor-pointer"
          >
            🏠 홈 (대시보드)
          </Link>
          <span className="block text-slate-400 font-bold px-4 py-3 rounded-xl cursor-not-allowed">
            📊 추천 리포트 내역
          </span>
          <span className="block text-slate-400 font-bold px-4 py-3 rounded-xl cursor-not-allowed">
            👤 마이페이지
          </span>
          <button
            onClick={handleLogout}
            className="w-full text-left text-rose-400 font-black px-4 py-3 rounded-xl transition-colors cursor-pointer"
          >
            🚪 로그아웃
          </button>
        </div>
      )}

      {/* 3. 메인 대시보드 콘텐츠 영역 */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
        
        {/* 상단 웰컴 배너 (Summary Banner) */}
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3e62] rounded-3xl border border-slate-800 p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
          {/* 배너 내부 은은한 광원 데코 */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-32 h-32 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-black px-3 py-1 rounded-full uppercase tracking-wider">
                DAILY NOTIFICATION
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                👋 {partnerName} 파트너 사장님,<br className="sm:hidden" /> 오늘 아침 추천 소싱 상품은 총 5건입니다.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-light">
                매일 새벽 수만 개의 실시간 쇼핑 및 언급 데이터를 전수 가공한 엄선된 노다지 목록입니다.
              </p>
            </div>
            
            {/* 요약 현황 뱃지 */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">소싱 성공 신뢰도</span>
                <span className="text-lg font-black text-emerald-400">97.8%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">데이터 업데이트</span>
                <span className="text-lg font-black text-blue-400">08:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ⚡ 카카오 알림톡 모의 전송 수동 검증 위젯 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* 장식용 테두리 조명 효과 */}
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] bg-yellow-100 text-yellow-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                PIVOT CORE SYSTEM
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
              💬 카카오 알림톡 자동화 발송 모의 검증 센터
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-normal leading-relaxed">
              매일 아침 8시 크론(Cron) 스케줄러가 작동하여 Supabase 큐에 등록된 회원들의 휴대폰으로 
              마진 리포트를 대행사 API(SOLAPI) 규격에 맞춰 전송하는 핵심 백엔드 기능입니다. 
              <strong> 아래 테스트 버튼을 누르면 즉각 모의 발송 루프가 수행됩니다.</strong>
            </p>
          </div>

          <div className="shrink-0 relative z-10">
            <button
              onClick={async () => {
                if (isSending) return;
                setIsSending(true);
                try {
                  const res = await fetch(`/api/cron/send-reports?partner=${partnerName}`);
                  const data = await res.json();
                  if (data.success) {
                    setSendResult(data);
                    setShowModal(true);
                  } else {
                    alert("모의 발송 시뮬레이션 중 오류가 발생했습니다.");
                  }
                } catch (err) {
                  console.error(err);
                  alert("서버 연결에 실패했습니다.");
                } finally {
                  setIsSending(false);
                }
              }}
              disabled={isSending}
              className={`w-full md:w-auto px-6 py-4 rounded-2xl font-black text-sm text-slate-950 flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md ${
                isSending 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-500 hover:to-amber-400 active:scale-95 cursor-pointer shadow-yellow-400/10 hover:shadow-lg"
              }`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>대량 발송 처리 중...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>카카오 알림톡 발송 모의 테스트 실행</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2분할 메인 콘텐츠 바디 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* [좌측 - 8대] 추천 상품 TOP 3 카드 리스트 (7컬럼 배치) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>🔥</span> 오늘 아침 8시 노다지 추천 상품 TOP 3
              </h3>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full">
                정밀도 순 정렬
              </span>
            </div>

            {/* 카드 리스트 루프 */}
            {sourcingProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-7 space-y-5 transition-all duration-300 hover:shadow-xl hover:border-slate-300 transform hover:-translate-y-0.5"
              >
                {/* 카드 헤더 */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-orange-50 text-orange-700 font-extrabold px-2.5 py-0.5 rounded-md">
                        {prod.badge}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{prod.category}</span>
                    </div>
                    <h4 className="text-base md:text-lg font-black text-slate-950 tracking-tight leading-snug">
                      {prod.emoji} {prod.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">급증율</span>
                    <span className="text-sm font-extrabold text-orange-600">{prod.growth}</span>
                  </div>
                </div>

                {/* 마진 통계 및 금융 레이아웃 */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">도매꾹 공급가</span>
                    <span className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 block">
                      {prod.wholesalePrice.toLocaleString()}원
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">네이버 판매가</span>
                    <span className="text-xs md:text-sm font-extrabold text-slate-900 mt-1 block">
                      {prod.retailPrice.toLocaleString()}원
                    </span>
                  </div>
                  <div className="bg-emerald-50 rounded-xl py-1">
                    <span className="text-[10px] text-emerald-800 block font-black">예상 마진율</span>
                    <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                      {prod.marginRate}%
                    </span>
                  </div>
                </div>

                {/* 예상 순수익 계산기 데코레이션 */}
                <div className="flex justify-between items-center text-xs text-slate-600 px-1 font-semibold">
                  <span className="text-slate-400 font-normal">개당 세전 예상 순수익</span>
                  <span className="text-slate-900 font-black text-xs md:text-sm">
                    약 +{prod.netProfit.toLocaleString()}원 이득 / 건당
                  </span>
                </div>

                {/* AI 한줄 분석관 진단 피드백 */}
                <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed">
                  <span className="font-extrabold text-blue-900 block mb-1">💡 AI 정밀 진단</span>
                  "{prod.aiOpinion}"
                </div>

                {/* 소싱 상세 분석 링크 (데코) */}
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100/80">
                  <span>📍 키워드: #{prod.title.split(" ").slice(-1)[0]} #무사입</span>
                  <span className="text-blue-600 font-bold underline cursor-not-allowed hover:text-blue-700">
                    실시간 공급 채널 연동 확인하기 →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* [우측 - 5대] 데이터 분석 키워드 그래프 차트 (5컬럼 배치) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>📈</span> 실시간 급상승 키워드 TOP 5
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">최근 24H 집계</span>
            </div>

            {/* 게이지 차트 수려한 카드 박스 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">실시간 트렌드 지수 1위</span>
                <span className="text-lg font-black text-[#1e3e62] mt-1 block">"감성 캠핑용품 언급 최고조"</span>
              </div>

              {/* 키워드 바 차트 루프 */}
              <div className="space-y-5">
                {trendingKeywords.map((item) => (
                  <div key={item.rank} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-800">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                          item.rank <= 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {item.rank}
                        </span>
                        <span>{item.keyword}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-light text-[10px]">트렌드 스코어</span>
                        <span className="text-blue-600">{item.score}</span>
                      </div>
                    </div>
                    
                    {/* 미려한 그라데이션 게이지Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (item.score / 250) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 분석관 최종 팁 박스 */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[11px] text-slate-500 leading-relaxed">
                📢 **데이터 분석 꿀팁**:<br />
                `감성 미니 랜턴` 및 `제습기` 관련 키워드가 상위권을 장기 점거 중입니다. 스마트스토어 혹은 쿠팡에 해당 키워드를 제목에 포함하여 매칭 등록 시, 노출수 확보가 타 키워드 대비 약 2.4배 수월합니다.
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 📱 카카오톡 스타일 프리뷰 팝업 모달 */}
      {showModal && sendResult && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1e1e] rounded-3xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl transition-all transform scale-100 flex flex-col max-h-[85vh]">
            
            {/* 모달 상단 헤더 */}
            <div className="bg-[#fdcb00] text-slate-900 px-6 py-4 flex items-center justify-between border-b border-yellow-500 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div className="text-left">
                  <span className="font-extrabold text-sm tracking-tight block leading-none">forSeller AI 알림톡</span>
                  <span className="text-[10px] text-slate-800 font-bold block mt-1">발송 결과 영수증</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900 font-black cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* 모달 바디 (카톡 메시지 컨테이너) */}
            <div className="p-6 bg-[#bacdce] flex-1 overflow-y-auto space-y-4 select-none animate-fade-in">
              
              {/* 시스템 모의 결과 현황판 */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
                <h4 className="font-extrabold text-xs text-slate-950 flex items-center gap-1.5 pb-1.5 border-b border-slate-100">
                  <span>📊</span> 백엔드 시뮬레이션 리포트
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-semibold">
                  <div>
                    <span className="text-slate-400 block font-normal">발송 대상자</span>
                    <span className="text-slate-900">{sendResult.totalCount}명 (대량 발송 루프 완료)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">DB 데이터 출처</span>
                    <span className="text-slate-900">{sendResult.usingFallback?.report ? "가상 모의 데이터" : "Supabase Live 테이블"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">기준 발송일자</span>
                    <span className="text-slate-900">{sendResult.processedDate}</span>
                  </div>
                  <div>
                    <span className="text-emerald-800 block font-normal">큐 동기화 상태</span>
                    <span className="text-emerald-600">성공 (Success)</span>
                  </div>
                </div>
              </div>

              {/* 카카오톡 메시지 거품 말풍선 */}
              <div className="flex items-start gap-2 max-w-[90%] text-left">
                <div className="w-9 h-9 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 select-none shadow-sm">
                  fS
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-600 font-bold block ml-0.5">forSeller AI</span>
                  
                  {/* 노란색 카톡 수신 박스 */}
                  <div className="bg-[#ffffffe6] border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                    {sendResult.messagePreview}
                  </div>
                </div>
              </div>

              {/* 터미널 출력 강조 안내 */}
              <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center text-white space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-yellow-400 font-black text-[11px]">
                  <span>📟</span>
                  <span>컴퓨터 터미널(Terminal) 콘솔 실시간 인쇄!</span>
                </div>
                <p className="text-[10px] text-slate-300 font-normal leading-normal">
                  서버 백엔드 실행 창에 가독성 극대화된 [100% 한글 알림톡 수신 프리뷰 박스]가 실시간으로 성공 인쇄되었습니다. Vercel 실서버 로그 및 로컬 VS Code 터미널에서 지금 즉시 확인해보세요!
                </p>
              </div>

            </div>

            {/* 모달 하단 */}
            <div className="bg-[#1e1e1e] p-4 border-t border-slate-800 flex gap-2 shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-[#fdcb00] hover:bg-yellow-500 active:scale-[0.98] text-slate-950 font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer text-center"
              >
                검증 및 연동 확인 완료
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
