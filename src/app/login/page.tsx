import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  auth_denied: '로그인이 취소되었습니다.',
  invalid_state: '보안 검증에 실패했습니다. 다시 시도해주세요.',
  server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
};

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMsg = searchParams.error
    ? (ERROR_MESSAGES[searchParams.error] ?? '로그인 중 오류가 발생했습니다.')
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] font-sans">
      <div className="flex w-full max-w-[880px] overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,.08)]">
        {/* Left: Login form */}
        <div className="flex flex-1 flex-col justify-center bg-white px-10 py-12">
          <div className="mb-8 text-[22px] font-bold tracking-tight text-[#331E62]">
            팀 달력<span className="text-[#3362FB]">.</span>
          </div>
          <h1 className="mb-1 text-xl font-bold text-[#1A1A2E]">로그인</h1>
          <p className="mb-7 text-sm text-[#64748B]">오피스넥스트 계정으로 업무를 시작하세요.</p>

          {errorMsg && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <Link
            href="/auth/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#E1E7EF] bg-white px-4 text-sm font-medium text-[#331E62] shadow-sm transition-colors hover:bg-[#F1F5F9] hover:text-[#0F1729] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3362FB]"
          >
            {/* OfficeNEXT icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
              width="22"
              height="22"
              aria-hidden="true"
              className="shrink-0"
            >
              <g clipPath="url(#on-clip)">
                <path fill="url(#on-grad)" d="M16 0H0v16h16z" />
                <path
                  fill="#95AFFF"
                  d="m9.714 3.808.018-.026h2.31l-2.8 4.08 3.003 4.356H9.921L8.039 9.49 6.777 7.862z"
                />
                <path
                  fill="#fff"
                  d="m6.286 3.808-.018-.026H3.957l2.8 4.08-3.002 4.356h2.324L7.963 9.49l1.26-1.629z"
                />
              </g>
              <defs>
                <linearGradient
                  id="on-grad"
                  x1="-370.255"
                  x2="1429.75"
                  y1="1745.67"
                  y2="456.439"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0D1C4B" />
                  <stop offset="0.983" stopColor="#3362FB" />
                </linearGradient>
                <clipPath id="on-clip">
                  <rect width="16" height="16" fill="#fff" rx="6" />
                </clipPath>
              </defs>
            </svg>
            오피스넥스트로 로그인
          </Link>
        </div>

        {/* Right: Promo panel */}
        <div className="hidden w-[340px] flex-col items-center justify-center bg-gradient-to-br from-[#331E62] to-[#3362FB] px-8 py-10 text-center text-white md:flex">
          <svg
            className="mb-6 h-16 w-16 opacity-90"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="16" fill="rgba(255,255,255,.15)" />
            <path
              fill="rgba(255,255,255,.4)"
              d="m38.856 15.232.072-.104h9.24l-11.2 16.32 12.012 17.424H39.684l-7.528-9.96-5.048-6.512z"
            />
            <path
              fill="#fff"
              d="m25.144 15.232-.072-.104H15.83l11.2 16.32-12.01 17.424h9.296l7.528-9.96 5.04-6.516z"
            />
          </svg>
          <h2 className="mb-3 text-lg font-bold leading-relaxed">
            오피스넥스트 IdP로
            <br />
            안전하게 통합 인증
          </h2>
          <p className="text-sm leading-relaxed text-white/75">
            SSO 연동으로 하나의 계정으로
            <br />
            모든 서비스에 안전하게 접속하세요.
          </p>
        </div>
      </div>

      <p className="fixed bottom-4 left-0 right-0 text-center text-[11px] text-[#94A3B8]">
        © 2026 팀 달력 — OfficeNEXT SSO
      </p>
    </div>
  );
}
