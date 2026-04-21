# Handoff — test-001

> 마지막 업데이트: 2026-04-21
> **참고**: 이 파일은 파이프라인 진행 상태를 추적합니다. `/pai design` 실행 후 자동 갱신.

<!-- roboco:start -->

## 파이프라인 진행 상태 (roboco 자동 관리)

### 완료

- [x] environment (pai init, 2026-04-21 02:37)
- [x] design (ideation + openspec + omc + harness 조정, 2026-04-21 12:30)

현재 단계: **design 완료 → execution 준비**

<!-- roboco:end -->

## 이번 세션 결정 요약

### MVP 범위 확정 (대시보드 집중)

- **포함**: KPI 대시보드 · 수동 데이터 입력 UI · 인증/권한 관리 · 리포트 스냅샷
- **v2 연기**: OfficeChat 알림 봇(ReminderRule), 외부 ETL, 양방향 봇
- **엔티티**: Team · Member · Metric · DataEntry · Report (+ AuditLog, Session placeholder)
- **엔드포인트**: 24개 — `docs/openspec.md` 5절 참조

### 스택 확정

- TypeScript + Next.js (App Router) + Supabase + Vercel + npm
- Vitest · ESLint · Prettier · `next build`

### 하네스 조정

- `.harness.json` — `build` 커맨드 `tsup` → `next build`
- `CLAUDE.md` — Project Overview 기술, Stack 상세 기록, Supabase 마이그레이션 체크리스트 추가
- `.github/pull_request_template.md` 신규 — 설계 계약 + 마이그레이션 체크리스트 포함

### 의사결정 메모

- **`package.json`은 사용자 수동 관리** — 현재 부재 상태. hook/CI가 실패하는 건 감수.
- **인증 방식은 placeholder** — 구현 단계 전에 확정 필요 (후보: Supabase Auth 매직링크 / SSO).
- **Supabase 마이그레이션 가드**는 자동 차단이 아닌 체크리스트(경고) 수준 — PR 템플릿 + CLAUDE.md 양쪽에 배치.

## 다음 단계

- [ ] **인증 방식 확정** — 구현 전 필수 결정 (placeholder 해소)
- [ ] **`package.json` 생성** — 사용자가 수동 작성 후 `npm install`
- [ ] **Execution** — `docs/openspec.md` 기반 Next.js 구현 (Claude Code 담당)
- [ ] **Supabase 스키마 생성** — `supabase/migrations/` 초기 마이그레이션
- [ ] `pai test` — 테스트 + 하네스 검증
- [ ] `pai grade` — AI 준비도 6카테고리 평가

## 메모

- 모드: production
- 락 충돌 시 즉시 실패 (다른 PAI 명령이 진행 중이면 완료 후 재시도)
- 이번 세션은 커밋하지 않음 (사용자 선택) — 필요 시 차후 `chore: initial commit` + `docs: complete design phase` 분리 제안
