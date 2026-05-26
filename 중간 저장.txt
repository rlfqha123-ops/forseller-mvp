"use client";

import { useState } from "react";

export default function Home() {
  // 사전 예약 폼 상태 관리
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("의류");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 연락처 포맷팅 함수 (자동 하이픈 추가)
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
    setErrorMessage("");
  };

  // 사전 예약 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("이름을 입력해 주세요.");
      return;
    }
    if (phone.length < 12) {
      setErrorMessage("올바른 연락처(10~11자리 숫자)를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    // 모의 비동기 처리 (네트워크 전송 효과)
    setTimeout(() => {
      // 로컬스토리지에 예약 데이터 저장 (시뮬레이션)
      const existingReservations = JSON.parse(localStorage.getItem("forSeller_reservations") || "[]");
      const newReservation = {
        name,
        phone,
        category,
        date: new Date().toISOString(),
      };
      existingReservations.push(newReservation);
      localStorage.setItem("forSeller_reservations", JSON.stringify(existingReservations));

      setIsSubmitting(false);
      setShowModal(true);
    }, 1200);
  };

  // 모달 닫기 및 폼 초기화
  const handleCloseModal = () => {
    setShowModal(false);
    setName("");
    setPhone("");
    setCategory("의류");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      {/* 
        네비게이션 헤더(<Navbar />)는 글로벌 레이아웃(layout.js)에 공통 배치되어 있으며,
        회원가입 폼은 독립된 가입 페이지(/signup)로 깔끔하게 이관되어 코드가 완전히 분리되었습니다.
      */}

      {/* 히어로 섹션 (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b192c] via-[#0f233c] to-[#0b192c] text-white pt-24 pb-32">
        {/* 네온 광원 효과 배경 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          {/* 어텐션 뱃지 */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/10 animate-pulse">
            🔥 런칭 전 특별 이벤트 첫 달 50% 할인
          </div>

          {/* 메인 카피 */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-normal text-white mb-6">
            매일 아침 8시, 마진 높고 재고 없는<br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-sm font-black">
              노다지 상품 정보
            </span>
            를 카톡으로 받아보세요
          </h1>

          {/* 서브 카피 */}
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            AI가 매일 새벽 국내외 5만여 개 도매 사이트와 트렌드를 전수 분석합니다.<br />
            마진율 40% 이상, 실시간 바이럴 지수 급증 아이템만 쏙쏙 짚어 알림톡으로 전송해 드립니다.
          </p>

          {/* 빠른 스크롤 이동 버튼 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#reservation-form"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 text-center"
            >
              사전 예약 신청하고 50% 할인받기
            </a>
            <a
              href="#sample-report"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 border border-white/10 text-center"
            >
              추천 리포트 예시 보기
            </a>
          </div>

          {/* 리스크 제로 약속 */}
          <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
            🔒 개인정보는 안전하게 암호화 처리되며 상업적으로 이용되지 않습니다.
          </p>
        </div>
      </section>

      {/* 예시 리포트 섹션 (Sample Report Section) */}
      <section id="sample-report" className="py-24 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-black tracking-widest uppercase bg-blue-50 px-3 py-1.5 rounded-md">
            SAMPLE DASHBOARD
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            매일 아침 도착하는 노다지 리포트 예시
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-3 max-w-xl mx-auto">
            가입 즉시 매일 카카오톡으로 발송되는 AI 정밀 분석 데이터 카드의 상세 사양입니다.
          </p>
        </div>

        {/* 대시보드 스타일의 럭셔리 카드 디자인 */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
          {/* 카드 상단 헤더 */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-bold tracking-wider">TODAY'S PICK (오늘 아침 8시 추천)</span>
            </div>
            <span className="text-xs text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">리포트 ID #260526</span>
          </div>

          {/* 카드 바디 */}
          <div className="p-6 md:p-8 space-y-6">
            {/* 상품 정보 및 기본 스펙 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-md">아웃도어/레저</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-950 mt-2 tracking-tight">
                  캠핑용 감성 충전식 미니 랜턴
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">수요 예측 성공 신뢰도</span>
                <span className="text-sm font-bold text-blue-600">97.8% (매우 높음)</span>
              </div>
            </div>

            {/* 핵심 금융/트렌드 통계 지표 대시보드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 도매꾹가 카드 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-medium">도매꾹 최소 공급가</span>
                <span className="text-xl font-extrabold text-slate-900 mt-2 block">4,500원</span>
                <span className="text-[10px] text-slate-400 mt-1">네이버 최저가 16,900원</span>
              </div>

              {/* 소셜 트렌드 급증 지표 카드 */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center flex flex-col justify-center relative overflow-hidden">
                <span className="text-xs text-orange-800 font-medium z-10">인스타 언급량 트렌드</span>
                <span className="text-xl font-extrabold text-orange-600 mt-2 block z-10">+240% 급증</span>
                <span className="text-[10px] text-orange-500 font-medium mt-1 z-10">지난주 대비 폭발적 상승</span>
                {/* 배경 미니 불꽃 아이콘 데코 */}
                <div className="absolute right-2 bottom-1 text-orange-400/10 text-5xl font-black select-none pointer-events-none">
                  🔥
                </div>
              </div>

              {/* 예상 마진율 지표 카드 */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center flex flex-col justify-center relative overflow-hidden">
                <span className="text-xs text-emerald-800 font-medium z-10">세전 예상 마진율</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block z-10">42%</span>
                <span className="text-[10px] text-emerald-500 font-medium mt-1 z-10">개당 마진 약 7,100원+</span>
                {/* 배경 달러 아이콘 데코 */}
                <div className="absolute right-2 bottom-1 text-emerald-400/10 text-5xl font-black select-none pointer-events-none">
                  ₩
                </div>
              </div>
            </div>

            {/* AI 정밀 분석 소견 */}
            <div className="bg-blue-50/40 border border-blue-100 p-5 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">💡</span>
                <span className="text-xs text-blue-900 font-extrabold uppercase tracking-wider">AI 분석관 한줄 진단</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "초여름 야간 캠핑 트렌드 유입과 인스타그램 릴스 기반의 감성 캠핑숏폼 바이럴이 맞물려 검색 지표가 급증했습니다. 도매가 공급 채널이 확실히 확보되어 있어 사입 리스크가 극히 적으며, 위탁으로도 마진율 40% 방어가 충분히 가능한 최적의 소싱 노다지 상품입니다."
              </p>
            </div>

            {/* 소싱 링크 및 꿀팁 (데코레이션) */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                📍 키워드 태그: #감성캠핑 #캠핑랜턴 #무재고소싱
              </span>
              <span className="text-slate-400 font-semibold text-[11px] underline cursor-not-allowed">
                실제 도매꾹 공급업체 다이렉트 링크 (런칭 시 개방) →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 장점 요약 섹션 */}
      <section className="bg-slate-100 py-20 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold mb-5">
              📦
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">무재고 소싱 리스트</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              사전에 대량 사입할 필요 없이, 판매 즉시 발송 대행이 가능한 무재고 도매 채널 공급가 정보를 필터링해 드립니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-5">
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">급상승 소셜 데이터 감지</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              네이버 트렌드와 더불어 인스타, 유튜브 쇼츠 언급 속도 급증 지표를 매칭하여 며칠 뒤 무조건 팔릴 상품을 한 발 앞서 소싱합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold mb-5">
              🔔
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">간편한 매일 아침 카톡 피드</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              복잡한 웹 대시보드 로그인이 필요 없습니다. 매일 아침 8시 카카오톡 알림톡으로 '오늘 사입해야 할 Top 3 상품' 카드가 도착합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 사전 예약 폼 섹션 (Form Section) */}
      <section id="reservation-form" className="py-24 max-w-xl mx-auto px-6 w-full scroll-mt-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 md:p-10 relative overflow-hidden">
          {/* 포인트 데코 */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-400/20 to-transparent rounded-tr-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <span className="text-orange-600 text-xs font-black tracking-wider bg-orange-50 px-3 py-1.5 rounded-full inline-block mb-3">
              PRE-REGISTER
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              지금 사전 예약하고<br />첫 달 50% 할인권 받기
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2.5 font-light">
              서비스 정식 오픈 시 알림톡으로 할인 쿠폰 번호와 무료 정보 이용권을 발급해 드립니다.
            </p>
          </div>

          {/* 에러 메시지 알럿 */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3.5 rounded-xl mb-6 flex items-center gap-1.5">
              <span>⚠️</span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* 폼 입력 영역 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name-input" className="block text-slate-700 text-xs font-extrabold mb-2 tracking-wide">
                이름 <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="홍길동"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
              />
            </div>

            {/* 연락처 입력 */}
            <div>
              <label htmlFor="phone-input" className="block text-slate-700 text-xs font-extrabold mb-2 tracking-wide">
                연락처 <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-blue-600 transition-all duration-200 outline-none"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                ※ 기입하신 번호로 첫 달 50% 모바일 쿠폰 및 오픈 알림 카카오톡 메시지가 발송됩니다.
              </span>
            </div>

            {/* 주로 취급하는 카테고리 (세련된 라디오/칩 선택 인터랙션) */}
            <div>
              <label className="block text-slate-700 text-xs font-extrabold mb-3 tracking-wide">
                주로 취급하는 카테고리
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {["의류", "생활용품", "잡화", "디지털", "뷰티", "기타"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-3 px-1 rounded-xl text-xs font-bold border transition-all duration-200 text-center ${
                      category === cat
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-2">
              <button
                id="submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-[length:200%_auto] hover:bg-right text-white font-black text-sm md:text-base py-4 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    예약 정보 전송 중...
                  </>
                ) : (
                  "사전 예약하고 첫 달 50% 할인받기"
                )}
              </button>
            </div>
          </form>

          {/* 면책 조항 (Footer / Disclaimer) - 리스크 방지용 카피 */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 leading-normal max-w-sm mx-auto">
              본 정보는 참고용 통계 지표이며, 사입 및 투자 결과에 대한 최종 책임은 사용자에게 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기업 푸터 및 로고 */}
      <footer className="bg-[#0b192c] text-slate-400 py-12 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-xs">
              fS
            </div>
            <span className="font-bold text-white text-base tracking-tight">forSeller AI</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">MVP</span>
          </div>
          <div className="text-xs text-slate-500 text-center md:text-right leading-relaxed">
            <p>© 2026 forSeller Inc. All rights reserved.</p>
            <p className="mt-1">AI 소싱 정보 문의: support@forseller.ai | 통계 데이터 업데이트 주기: 매 24시간</p>
          </div>
        </div>
      </footer>

      {/* 사전 예약 완료 모달 레이어 (Modal Layer) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-2xl p-6 md:p-8 text-center relative overflow-hidden transition-all duration-300 transform scale-100">
            {/* 상단 체크 애니메이션 그래픽 */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 animate-bounce">
              ✓
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              사전 예약 신청이 완료되었습니다!
            </h3>
            
            <p className="text-slate-500 text-xs md:text-sm mt-3 leading-relaxed">
              성공적으로 정보가 입력되었습니다. 서비스 정식 런칭일에 맞춰 아래 번호로 무료 정보 이용권과 첫 달 50% 쿠폰이 즉시 발송됩니다.
            </p>

            {/* 입력 확인 데이터 영수증 박스 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-6 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">예약자명</span>
                <span className="font-bold text-slate-900">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">발송 연락처</span>
                <span className="font-bold text-slate-900">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">관심 카테고리</span>
                <span className="font-bold text-slate-800">{category}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dashed border-slate-200 text-blue-600">
                <span>사전 예약 혜택</span>
                <span className="font-bold">런칭 알림톡 + 50% 할인 쿠폰</span>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-md"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
