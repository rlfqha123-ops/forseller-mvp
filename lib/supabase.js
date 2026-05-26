import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 키값 검증 및 플레이스홀더 체크 경고
if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY_HERE") {
  console.warn(
    "⚠️ Supabase URL 또는 Anon Key가 올바르게 설정되지 않았습니다.\n" +
    "프로젝트 루트의 `.env.local` 파일에 실제 Supabase Key를 기입해 주셔야 회원가입 및 로그인이 정상 작동합니다."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
