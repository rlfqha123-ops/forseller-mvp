import { createClient } from "@supabase/supabase-js";

// Vercel 환경 변수 누락 또는 빌드 타임 하드코딩 치환 꼬임 문제를 100% 원천 방지하기 위해 
// 사용자의 실제 수파베이스 프로젝트 URL과 Anon Key를 상수로 단단히 고정 바인딩합니다.
// [FORCE VERCEL REBUILD] 버셀 대시보드의 수정된 NEXT_PUBLIC_SUPABASE_URL 환경 변수가 정상 반영되도록 신규 빌드를 강제 유도합니다.
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawSupabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables!");
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

console.log("Resolved Supabase URL in client:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
