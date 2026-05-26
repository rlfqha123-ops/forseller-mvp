import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendKakaoReport } from "@/lib/kakaoService";

export async function GET(request) {
  // 호출한 URL 파라미터에서 혹시 모를 파트너명 추출 (수동 테스트 지원용)
  const { searchParams } = new URL(request.url);
  const targetPartner = searchParams.get("partner") || "rlfqha123-ops";

  // 1. 오늘 날짜 포맷팅 (KST 기준 YYYY-MM-DD)
  const todayKST = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  let reportData = null;
  let useFallbackReport = false;
  let queueList = [];
  let useFallbackQueue = false;

  console.log(`[API CRON] ⏰ 아침 8시 카카오 알림톡 전송 프로세스 시동 (기준일: ${todayKST})`);

  // 2. Supabase에서 오늘자 kakao_reports 조회 시도
  try {
    const { data: dbReport, error: reportError } = await supabase
      .from("kakao_reports")
      .select("*")
      .eq("send_date", todayKST)
      .maybeSingle();

    if (reportError) {
      console.warn("⚠️ Supabase 'kakao_reports' 조회 실패 (테이블 미생성 또는 연결 오류):", reportError.message);
      useFallbackReport = true;
    } else if (dbReport) {
      reportData = dbReport;
      console.log("✅ Supabase로부터 오늘자 공식 AI 리포트를 성공적으로 로드했습니다.");
    } else {
      console.log("ℹ️ 오늘 날짜로 등록된 Supabase 리포트 데이터가 없어 가상 시뮬레이션 데이터를 빌드합니다.");
      useFallbackReport = true;
    }
  } catch (err) {
    console.error("❌ Supabase 연동 중 예측 못한 오류 발생:", err);
    useFallbackReport = true;
  }

  // 3. Fallback 상품 리포트 빌드 (Supabase 미연동 또는 데이터 누락 시 안전장치)
  if (useFallbackReport || !reportData) {
    reportData = {
      send_date: todayKST,
      prod_1_title: "캠핑용 감성 충전식 미니 랜턴",
      prod_1_wholesale: 4500,
      prod_1_retail: 16900,
      prod_1_margin: 42,
      prod_1_emoji: "🔦",
      prod_2_title: "핸디형 2-in-1 무선 미니 진공 청소기",
      prod_2_wholesale: 12000,
      prod_2_retail: 29800,
      prod_2_margin: 45,
      prod_2_emoji: "🧹",
      prod_3_title: "원룸 무소음 미니 제습기 (USB형)",
      prod_3_wholesale: 15900,
      prod_3_retail: 39900,
      prod_3_margin: 48,
      prod_3_emoji: "💧",
      ai_diagnosis: "야외 캠핑 시즌 특수와 실내 고온다습 기상 통계가 맞물리면서 소형 가전 및 감성 소품 카테고리의 트렌드 상승 속도가 최고조에 달했습니다. 초보 마진 확보 최적기입니다.",
    };
  }

  // 4. Supabase 발송 대기 큐 (kakao_sending_queue)에서 pending 상태의 회원들 가져오기
  try {
    if (!useFallbackReport) {
      const { data: dbQueue, error: queueError } = await supabase
        .from("kakao_sending_queue")
        .select("*")
        .eq("report_id", reportData.id)
        .eq("status", "pending");

      if (queueError) {
        console.warn("⚠️ Supabase 발송 큐 조회 실패:", queueError.message);
        useFallbackQueue = true;
      } else if (dbQueue && dbQueue.length > 0) {
        queueList = dbQueue;
        console.log(`✅ Supabase 발송 대기 큐에서 대기자 ${queueList.length}명을 성공적으로 추출했습니다.`);
      } else {
        console.log("ℹ️ 발송 대기 큐(pending)가 비어 있어 모의 테스트 가입자를 큐로 등록합니다.");
        useFallbackQueue = true;
      }
    } else {
      useFallbackQueue = true;
    }
  } catch (err) {
    useFallbackQueue = true;
  }

  // 5. Fallback 발송 큐 생성 (Supabase 미연동 또는 테스트 용도 지원)
  if (useFallbackQueue || queueList.length === 0) {
    queueList = [
      {
        id: "sim_q_1",
        receiver_name: targetPartner,
        receiver_phone: "010-1234-5678",
        status: "pending",
      },
      {
        id: "sim_q_2",
        receiver_name: "홍길동",
        receiver_phone: "010-9876-5432",
        status: "pending",
      },
    ];
  }

  // 6. 알림톡 순차 전송 실행 및 시뮬레이터 구동
  const results = [];
  for (const recipient of queueList) {
    try {
      const { receiver_name, receiver_phone, id: queueId } = recipient;
      console.log(`[API CRON] 👉 ${receiver_name} 사장님 (${receiver_phone}) 모의 전송 큐 처리 중...`);

      // 카카오 전송 시뮬레이터 가동
      const sendResult = await sendKakaoReport(receiver_name, receiver_phone, reportData);

      // 성공 시 Supabase 큐 상태 업데이트 시도 (실제 연동된 경우)
      if (!useFallbackQueue && typeof queueId === "number") {
        await supabase
          .from("kakao_sending_queue")
          .update({
            status: "completed",
            sent_at: new Date().toISOString(),
          })
          .eq("id", queueId);
      }

      results.push({
        recipient: receiver_name,
        phone: receiver_phone,
        success: sendResult.success,
        messageId: sendResult.messageId,
      });
    } catch (sendErr) {
      console.error(`❌ ${recipient.receiver_name} 사장님 알림톡 발송 에러:`, sendErr);
      
      if (!useFallbackQueue && typeof recipient.id === "number") {
        await supabase
          .from("kakao_sending_queue")
          .update({
            status: "failed",
            error_message: sendErr.message || "Unknown simulator error",
          })
          .eq("id", recipient.id);
      }

      results.push({
        recipient: recipient.receiver_name,
        phone: recipient.receiver_phone,
        success: false,
        error: sendErr.message,
      });
    }
  }

  console.log(`[API CRON] 🏁 알림톡 모의 발송 루프 완료. 총 ${results.length}건 처리 완료.`);

  // 7. 결과 및 전송 알림톡 샘플 뷰를 JSON으로 응답
  // (이 JSON 정보를 바탕으로 대시보드 UI에 엄청나게 세련된 모의 영수증 팝업을 띄울 수 있음)
  const sampleMessagePreview = `🔥 [forSeller AI] ${targetPartner} 사장님, 오늘 아침 8시 노다지 상품 리포트입니다!

AI가 분석한 오늘 아침 마진 최고조 및 트렌드 급상승 Top 3 추천 소싱 리스트입니다.

=============================

1️⃣ ${reportData.prod_1_emoji} ${reportData.prod_1_title}
  • 도매꾹가: ${reportData.prod_1_wholesale.toLocaleString()}원
  • 최저소매가: ${reportData.prod_1_retail.toLocaleString()}원
  • 예상마진율: 🔥 ${reportData.prod_1_margin}% (개당 약 ${(reportData.prod_1_retail - reportData.prod_1_wholesale).toLocaleString()}원+ 순수익)

2️⃣ ${reportData.prod_2_emoji} ${reportData.prod_2_title}
  • 도매꾹가: ${reportData.prod_2_wholesale.toLocaleString()}원
  • 최저소매가: ${reportData.prod_2_retail.toLocaleString()}원
  • 예상마진율: ⚡ ${reportData.prod_2_margin}% (개당 약 ${(reportData.prod_2_retail - reportData.prod_2_wholesale).toLocaleString()}원+ 순수익)

3️⃣ ${reportData.prod_3_emoji} ${reportData.prod_3_title}
  • 도매꾹가: ${reportData.prod_3_wholesale.toLocaleString()}원
  • 최저소매가: ${reportData.prod_3_retail.toLocaleString()}원
  • 예상마진율: 💧 ${reportData.prod_3_margin}% (개당 약 ${(reportData.prod_3_retail - reportData.prod_3_wholesale).toLocaleString()}원+ 순수익)

=============================

💡 [오늘의 AI 정밀 진단 소견]
"${reportData.ai_diagnosis}"`;

  return NextResponse.json({
    success: true,
    processedDate: todayKST,
    totalCount: results.length,
    results: results,
    usingFallback: {
      report: useFallbackReport,
      queue: useFallbackQueue,
    },
    messagePreview: sampleMessagePreview,
  });
}
