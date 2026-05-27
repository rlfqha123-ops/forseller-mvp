import { createClient } from "@supabase/supabase-js";

// Vercel 환경 변수 누락 또는 빌드 타임 하드코딩 치환 꼬임 문제를 100% 원천 방지하기 위해 
// 사용자의 실제 수파베이스 프로젝트 URL과 Anon Key를 상수로 단단히 고정 바인딩합니다.
const supabaseUrl = "https://ysqvirbmfgxsnsdhqgag.supabase.co";
const supabaseAnonKey = "sb_publishable_WtWP2p12zJ5VwOt3lv2JMQ_Dz_9N-TV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
