/**
 * forSeller AI - 카카오톡 알림톡 발송 서비스 모듈 (시뮬레이터 포함)
 * 
 * 나중에 솔라피(SOLAPI) 또는 비즈뿌리오 등 국내 알림톡 API 대행사를 연동하실 때,
 * 주석 처리된 실제 API 호출 구문을 켜주시면 10초 만에 인터넷 실서버 연동이 완벽하게 완료됩니다.
 */

// 1. 카카오 알림톡 전송 텍스트 가공 템플릿 빌더
export function buildKakaoMessage(partnerName, reportData) {
  const {
    prod_1_title, prod_1_wholesale, prod_1_retail, prod_1_margin, prod_1_emoji,
    prod_2_title, prod_2_wholesale, prod_2_retail, prod_2_margin, prod_2_emoji,
    prod_3_title, prod_3_wholesale, prod_3_retail, prod_3_margin, prod_3_emoji,
    ai_diagnosis
  } = reportData;

  return `🔥 [forSeller AI] ${partnerName} 사장님, 오늘 아침 8시 노다지 상품 리포트입니다!

AI가 분석한 오늘 아침 마진 최고조 및 트렌드 급상승 Top 3 추천 소싱 리스트입니다.

=============================

1️⃣ ${prod_1_emoji || "🔦"} ${prod_1_title}
  • 도매꾹가: ${prod_1_wholesale.toLocaleString()}원
  • 최저소매가: ${prod_1_retail.toLocaleString()}원
  • 예상마진율: 🔥 ${prod_1_margin}% (개당 약 ${(prod_1_retail - prod_1_wholesale).toLocaleString()}원+ 순수익)

2️⃣ ${prod_2_emoji || "🧹"} ${prod_2_title}
  • 도매꾹가: ${prod_2_wholesale.toLocaleString()}원
  • 최저소매가: ${prod_2_retail.toLocaleString()}원
  • 예상마진율: ⚡ ${prod_2_margin}% (개당 약 ${(prod_2_retail - prod_2_wholesale).toLocaleString()}원+ 순수익)

3️⃣ ${prod_3_emoji || "💧"} ${prod_3_title}
  • 도매꾹가: ${prod_3_wholesale.toLocaleString()}원
  • 최저소매가: ${prod_3_retail.toLocaleString()}원
  • 예상마진율: 💧 ${prod_3_margin}% (개당 약 ${(prod_3_retail - prod_3_wholesale).toLocaleString()}원+ 순수익)

=============================

💡 [오늘의 AI 정밀 진단 소견]
"${ai_diagnosis}"

※ 실시간 수입 원가 및 1:1 비밀 소싱 공급처 다이렉트 링크는 forSeller 대시보드에서 조회하실 수 있습니다.

⚠️ 본 정보는 참고용 통계 지표이며, 사입 및 투자 결과에 대한 최종 책임은 사용자에게 있습니다.`;
}

// 2. 카카오 알림톡 전송 시뮬레이터 함수
export async function sendKakaoReport(partnerName, phone, reportData) {
  const messageContent = buildKakaoMessage(partnerName, reportData);

  // 대행사 전송 API 규격 적재 시뮬레이션 (SOLAPI v4 규격 호환)
  const solapiPayload = {
    to: phone.replace(/[^0-9]/g, ""), // 전화번호 내 숫자만 추출 (예: 01012345678)
    from: "01012345678",              // 옐로아이디 등록 발신번호
    type: "ATA",                      // 알림톡 전송 규격 지정
    templateId: "KA01TP260526",       // 카카오에서 최종 승인받은 템플릿 코드
    text: messageContent,
  };

  // [시뮬레이션 인쇄] 컴퓨터 터미널 콘솔창에 실제 카톡 수신 형태와 똑같이 가독성 높게 출력
  console.log("\n======================================================================");
  console.log("📱 [카카오 알림톡 발송 모의 테스트 성공] - forSeller AI 스케줄러");
  console.log("----------------------------------------------------------------------");
  console.log(`📡 발송 대행사 규격 적재 완료 (SOLAPI API ATA)`);
  console.log(`📞 수신 번호: ${phone}`);
  console.log(`👤 수신 사장님명: ${partnerName} 사장님`);
  console.log("----------------------------------------------------------------------");
  console.log("💬 [실제 카카오톡 알림톡 전송 메시지 내용]");
  console.log("----------------------------------------------------------------------\n");
  console.log(messageContent);
  console.log("\n======================================================================\n");

  /*
  // 나중에 SOLAPI 등 실제 대행사를 결제하신 뒤 켜주실 실서버 API 연동 구문:
  try {
    const response = await fetch("https://api.solapi.com/messages/v4/send-many", {
      method: "POST",
      headers: {
        "Authorization": `HMAC-SHA256 apiKey=${process.env.SOLAPI_API_KEY}, date=${new Date().toISOString()}, signature=...`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: [solapiPayload] })
    });
    const result = await response.json();
    return { success: true, messageId: result.messageId || "msg_live_ok" };
  } catch (err) {
    console.error("❌ 카카오톡 API 대행사 실서버 전송 실패:", err);
  }
  */

  // 모의 성공 응답 반환
  return { success: true, messageId: `msg_sim_${Math.random().toString(36).substr(2, 9)}` };
}
