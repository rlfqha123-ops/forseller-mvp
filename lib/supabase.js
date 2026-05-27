import { createClient } from "@supabase/supabase-js";

// Vercel 환경 변수 누락 또는 빌드 타임 하드코딩 치환 꼬임 문제를 100% 원천 방지하기 위해 
// 사용자의 실제 수파베이스 프로젝트 URL과 Anon Key를 상수로 단단히 고정 바인딩합니다.
// [FORCE VERCEL REBUILD] 버셀 대시보드의 수정된 NEXT_PUBLIC_SUPABASE_URL 환경 변수가 정상 반영되도록 신규 빌드를 강제 유도합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables!");
}

console.log("Resolved Supabase URL in client:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
