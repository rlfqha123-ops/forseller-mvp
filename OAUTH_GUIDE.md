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

Next.js 클라이언트 코드(`signInWithOAuth`)에서 소셜 로그인 호출 시 `redirectTo` 옵션에 `window.location.origin/auth/callback`을 지정하도록 안전하고 유연하게 코드가 설계되어 있습니다. 

따라서 실제 Vercel 등으로 배포를 진행한 경우, 사용자가 로그인 완료 후 버셀 앱 화면으로 정상 라우팅되도록 **수파베이스 대시보드의 URL 설정 및 카카오 프로바이더 옵션**을 완벽하게 맞추어 주어야만 에러가 발생하지 않습니다.

### 🚨 [중요] 수파베이스 콘솔 2단계 최종 조치 사항

#### 1) Site URL 및 Redirect URLs 설정 (localhost 튕김 현상 해결)
카카오 로그인 완료 후 실제 버셀 주소가 아닌 `localhost:3000`으로 튕기는 문제는 Next.js 코드 오류가 아니라, **수파베이스 대시보드에 등록된 사이트 대표 주소가 localhost로 지정되어 있어 수파베이스 인증서버가 그곳으로 강제 리다이렉트하기 때문**입니다.
* **Supabase Dashboard 접속** > `Authentication` > `URL Configuration`으로 이동합니다.
* **Site URL** 값을 `http://localhost:3000`에서 실제 버셀 도메인인 **`https://forseller-mvp.vercel.app`**으로 수정합니다.
* **Redirect URLs** 목록에 **`https://forseller-mvp.vercel.app/auth/callback`** 주소가 정상적으로 등록되어 있는지 다시 확인하고, 없다면 반드시 추가 후 **Save** 버튼을 누릅니다.

#### 2) Kakao Provider 설정의 '이메일 없는 사용자 허용' 활성화 (이메일 에러 해결)
개인 개발자용 카카오 앱은 사용자 이메일(`account_email`) 수집 권한을 가질 수 없습니다. 이 상태에서 로그인 동의 후 수파베이스 인증서버가 유저 생성을 시도할 때, 이메일 정보가 유실되어 `Error getting user email from external provider` 에러를 던지며 프로세스를 차단합니다.
* **Supabase Dashboard 접속** > `Authentication` > `Providers` > **`Kakao`** 설정 메뉴로 이동합니다.
* **`Allow users without an email`** (이메일 없는 사용자 허용) 토글 스위치를 **ON (활성화)** 상태로 켭니다.
* 설정 완료 후 하단의 **Save** 버튼을 눌러 저장합니다.
* 이 설정이 완료되면, 이메일 권한이 없는 개인 개발자용 카카오 앱 환경에서도 수파베이스가 정상적으로 닉네임과 프로필 정보를 매칭하여 신규 유저 등록 및 대시보드 로그인 처리를 성공적으로 마감합니다.

