import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6 bg-slate-50 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* 딥블루 은은한 배경 데코 광원 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* 이전에 구축된 고품격 회원가입 컴포넌트 로드 */}
      <div className="w-full max-w-lg z-10 animate-fade-in">
        <SignUpForm />
      </div>
    </div>
  );
}
