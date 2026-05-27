# forSeller AI - 구글 & 카카오 소셜 로그인 연동 설정 가이드

본 문서는 Supabase Auth를 기반으로 구글(Google) 및 카카오(Kakao) 1초 소셜 로그인을 상용 서비스 및 Vercel 배포 환경에서 정상 작동시키기 위해 각 플랫폼 개발자 콘솔에서 설정해야 하는 상세 안내서입니다.

---

## 🚨 핵심 수파베이스 Redirect URI 규격
각 소셜 플랫폼 개발자 센터 등록 시, 수파베이스가 인증 데이터를 가로채서 처리할 수 있도록 아래의 **Callback URL**을 반드시 등록해야 합니다.

* **수파베이스 프로젝트 Callback URL**: 
  `https://ysqvirbmfgxsnsdhqgag.supabase.co/auth/v1/callback`

---

## 1. Google 소셜 로그인 설정 (Google Cloud Console)

1. **Google Cloud Console 접속**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **프로젝트 선택/생성**: `forseller-mvp` 프로젝트를 생성하거나 선택합니다.
3. **OAuth 동의 화면 설정**:
   * `API 및 서비스` > `OAuth 동의 화면`으로 이동합니다.
   * User Type을 **외부 (External)**로 선택하고 필수 항목(앱 이름, 지원 이메일 등)을 작성합니다.
   * 범위(Scope) 설정 단계에서 `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`를 추가합니다.
4. **사용자 인증 정보 생성**:
   * `사용자 인증 정보` > `+ 사용자 인증 정보 만들기` > **`OAuth 클라이언트 ID`**를 선택합니다.
   * 애플리케이션 유형: **웹 애플리케이션 (Web Application)**
   * 이름: `forSeller AI (Supabase)`
   * **승인된 리다이렉션 URI (Authorized redirect URIs)**:
     * `https://ysqvirbmfgxsnsdhqgag.supabase.co/auth/v1/callback` 추가
5. **수파베이스 대시보드 등록**:
   * 발급된 **클라이언트 ID (Client ID)**와 **클라이언트 보안 비밀번호 (Client Secret)**를 복사합니다.
   * [Supabase Dashboard](https://supabase.com/) > `Authentication` > `Providers` > **`Google`** 활성화 후 값을 기입하고 저장합니다.

---

## 2. 카카오 소셜 로그인 설정 (Kakao Developers)

1. **Kakao Developers 접속**: [https://developers.kakao.com/](https://developers.kakao.com/)
2. **애플리케이션 추가**: `내 애플리케이션` > `애플리케이션 추가하기` (앱 이름: `forSeller AI`, 사업자명: `forSeller`)
3. **카카오 로그인 활성화**:
   * `제품 설정` > `카카오 로그인`으로 이동하여 상태를 **ON**으로 변경합니다.
   * **Redirect URI 등록**:
     * `https://ysqvirbmfgxsnsdhqgag.supabase.co/auth/v1/callback` 추가 후 저장합니다.
4. **동의 항목 설정**:
   * `카카오 로그인` > `동의항목` 메뉴로 이동합니다.
   * **닉네임** (필수 동의), **프로필 사진** (선택 동의), **카카오계정(이메일)** (필수 또는 선택 동의) 항목을 설정합니다.
5. **보안 비밀키 발급 (Client Secret)**:
   * `카카오 로그인` > `보안`으로 이동합니다.
   * Client Secret 항목의 **코드 발급**을 눌러 비밀키를 생성하고, 사용 상태를 **활성화 (ON)**로 변경합니다.
6. **수파베이스 대시보드 등록**:
   * **Client ID**: `내 애플리케이션` > `앱 설정` > `앱 키`에서 **`REST API 키`**를 복사해 사용합니다.
   * **Client Secret**: 위 5단계에서 발급한 **`Client Secret`** 비밀키 값을 복사합니다.
   * [Supabase Dashboard](https://supabase.com/) > `Authentication` > `Providers` > **`Kakao`** 활성화 후 두 값을 기입하고 저장합니다.

---

## 3. 버셀 (Vercel) 배포 시 추가 설정 (Redirect URLs)

Next.js 클라이언트 코드(`signInWithOAuth`)에서 소셜 로그인 호출 시 `redirectTo` 옵션에 `window.location.origin/auth/callback`을 지정하도록 안전하게 코드가 작성되어 있습니다. 

따라서 실제 Vercel 등으로 배포를 진행한 경우, 사용자가 로그인 완료 후 버셀 앱 화면으로 정상 라우팅되도록 **수파베이스 대시보드에 프로덕션 도메인을 허용 등록**해주어야 합니다.

1. **Supabase 대시보드 접속** > `Authentication` > `URL Configuration`으로 이동합니다.
2. **Redirect URLs** 섹션에 버셀 프로덕션 주소를 추가합니다.
   * 예: `https://forseller-mvp.vercel.app/auth/callback`
   * 개발 환경 주소(`http://localhost:3000/auth/callback`)는 Supabase가 자동으로 허용하므로 별도로 추가하지 않아도 무방합니다.
