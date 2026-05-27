import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// PKCE Authorization Code Flow를 가로채서 세션을 안전하게 교환(Exchange)하는 서버사이드 라우터 핸들러입니다.
// 이 핸들러가 존재해야 Vercel 배포 환경에서 ?code= 쿼리 파라미터 유입 시 404를 내뱉지 않고 정상 로그인 처리됩니다.
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // 로그인 성공 시 최종 이동할 대시보드 경로 지정
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!rawSupabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=missing-env`);
    }

    // 수파베이스 콘솔 URL(supabase.com/dashboard/project/...)이 환경 변수에 오기입되었을 때, 
    // 코드가 런타임에서 자동으로 실제 API URL(.supabase.co)로 파싱하여 자가 치료(Self-Healing)하는 극초안정성 디버깅 필터입니다.
    let supabaseUrl = rawSupabaseUrl;
    if (rawSupabaseUrl.includes("supabase.com/dashboard/project/")) {
      const parts = rawSupabaseUrl.split("supabase.com/dashboard/project/");
      if (parts.length > 1) {
        const projectId = parts[1].split("/")[0].trim();
        supabaseUrl = `https://${projectId}.supabase.co`;
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // 서버사이드는 세션 보관을 하지 않음 (쿠키 교환 완료 후 클라이언트에 위임)
      },
    });

    // 쿼리로 넘어온 일회성 code를 실제 로그인 세션(Session Token)으로 물리적 교환합니다!
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 토큰 교환에 성공하면, 버셀 도메인의 대시보드(/dashboard) 경로로 안전하게 리다이렉트합니다.
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
  }

  // 로그인 인증 토큰 교환 실패 시 오류 쿼리를 안고 로그인 페이지로 복귀시킵니다.
  return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth-exchange-failed`);
}
