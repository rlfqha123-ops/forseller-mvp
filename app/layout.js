import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata = {
  title: "forSeller AI | 매일 아침 8시, 무재고 고마진 소싱 리포트",
  description: "AI가 매일 분석한 트렌드와 마진율 40% 이상의 노다지 상품 정보를 카카오톡으로 받아보세요. 리스크 없는 이커머스 셀러의 지름길.",
  keywords: "이커머스, 쇼핑몰 창업, 소싱, 도매꾹, 사입, 무재고 소싱, AI 추천 상품",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
