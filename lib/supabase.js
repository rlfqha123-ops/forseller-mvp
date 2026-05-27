import { createClient } from "@supabase/supabase-js";

// Vercel 배포 시 .env.local이 누락되더라도 404 오류(대표 도메인으로 API를 호출해버리는 문제)를 방지하기 위해 스마트 폴백(Smart Fallback)을 구축합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ysqvirbmfgxsnsdhqgag.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_WtWP2p12zJ5VwOt3lv2JMQ_Dz_9N-TV";

// 키값 검증 및 플레이스홀더 체크 경고
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY_HERE") {
  console.warn(
    "⚠️ Supabase URL 또는 Anon Key 환경 변수가 완벽히 인식되지 않아 기본 폴백 키로 작동 중입니다.\n" +
    "로컬 `.env.local` 또는 Vercel 대시보드 환경 변수(Environment Variables)에 키를 등록하시면 안전하게 오버라이드됩니다."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
