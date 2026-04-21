# test-001

## Project Overview

사내 팀 지표가 엑셀·구글시트·개인 문서에 흩어져 있어 주기 리포트·대시보드 작성에 사람 시간이 반복 낭비되는 문제를 해결하는 **사내 팀 전용 도구**다. MVP는 KPI 대시보드 · 수동 데이터 입력 UI · 인증/권한 3가지에 집중하며, OfficeChat 알림 봇은 v2 로드맵이다.

자세한 제품 요구사항: `docs/openspec.md` · 도메인 모델: `.pai/omc.md`

<pai>
## PAI Configuration

This project uses PAI (Plugin-based AI) for structured AI development.

### Pipeline: Environment → Design → Execution → Validation → Evaluation

1. **Environment** — 프로젝트 환경 구성 (완료)
2. **Design** — OpenSpec (`docs/openspec.md`) + OMC (`.pai/omc.md`) 기반 설계
3. **Execution** — AI 코드 생성 (이 단계 Claude가 담당)
4. **Validation** — gstack 테스트 + harness(설계↔구현) 검증
5. **Evaluation** — 6카테고리 품질 평가

### Stack

- **Language**: TypeScript (strict)
- **Framework**: Next.js (App Router) — API는 `app/api/**` route handlers
- **Database**: Supabase (Postgres) — RLS 정책으로 팀 격리
- **Deployment**: Vercel
- **Package Manager**: npm (수동 관리 — `package.json` 파일은 사용자가 직접 유지)
- **Tools**: omc, openspec, harness
- **Mode**: production
- **Config**: `.pai/config.json`

### 플러그인 간 계약 (파이프라인 엣지)

`.pai/config.json`의 `edges` 배열이 플러그인 간 명시적 계약을 정의합니다.
코드 작성 시 반드시 계약을 지키세요:

- **harness → openspec**: `docs/openspec.md`의 엔드포인트 테이블이 구현과 일치해야 함 (`pai test` 실패)
- **gstack → openspec**: 각 엔드포인트는 테스트가 존재해야 함
- **omc → openspec**: 도메인 객체는 API 요청/응답 모델과 정합 (새 엔드포인트 추가 시 omc.md도 업데이트)
- **harness → omc**: `.pai/omc.md`의 비즈니스 규칙이 코드로 구현되어야 함

### Global Rules

- **심층 인터뷰 자동 수행**: 모호한 경우 AskUserQuestion으로 즉시 질문. 추측 금지.
- **설계 먼저**: 코드 전 `docs/openspec.md`를 먼저 읽고, 필요한 엔드포인트/모델을 정의.
- **계약 양방향 업데이트**: API 추가 시 openspec.md + omc.md 동시 수정. 하나만 업데이트하는 PR 금지.
- **검증 우선**: `pai test` 실패 시 수정 범위를 좁히고 원인을 정확히 이해할 것. `--skip`/ disable 금지.
- **Git 커밋 규칙**: 작업 단위별로 의미 있는 커밋 메시지.

### 명령어

- `pai status` — 현재 플러그인/모드 확인
- `pai test` — 테스트 + 하네스 검증
- `pai grade` — 6카테고리 품질 평가
- `pai add` — 플러그인 추가 / 모드 승격

### Contribution Guide

기여자는 `CONTRIBUTING.md`를 참고하세요. 이 가이드는 `.claude/skills/`에 스킬로 등록되어 자동 적용됩니다.
</pai>

<!-- pai:recipes:start -->

## 사내 시스템 연동

다음 레시피가 설치되어 있습니다. 관련 기능 구현 시 **반드시** 해당 경로의
`guideline.md`를 먼저 읽고 지침을 따르세요:

- **메신저 챗봇 (Office Chat)** — `docs/recipes/officechat/`
  환경변수: `OFFICECHAT_HOST`, `OFFICECHAT_TOKEN`, `OFFICECHAT_CHANNEL`

환경변수 값은 `.env.local`에 채워져 있어야 합니다.

<!-- pai:recipes:end -->

<!-- harness:start -->

## Harness Rules (production)

- spec 없는 기능 구현 금지 — 반드시 OpenSpec 먼저 작성
- 큰 변경은 plan → implement → review → verify 순서로 진행
- PR 머지 전 리뷰 필수
- main/develop 브랜치 직접 push 금지
- pre-commit/pre-push/CI를 통과하지 못하면 완료로 보지 않음
- 기존 script 외 임의 명령 최소화 — package.json scripts를 사용

### Supabase 마이그레이션 체크리스트

`supabase/migrations/**`를 변경하는 모든 PR은 다음 체크리스트를 PR 본문에 포함해야 한다 (자동 차단이 아닌 경고·체크 수준):

- [ ] 로컬에서 `supabase db diff`로 SQL 변경 미리보기 확인
- [ ] 마이그레이션 스크립트가 **idempotent**한지 검토 (`IF NOT EXISTS` 등)
- [ ] 기존 데이터 손실 여부 확인 — 파괴적 변경이면 롤백 플랜 기재
- [ ] RLS 정책 변경 시 팀 격리 규칙(`.pai/omc.md` 비즈니스 규칙)과 정합 여부 확인
- [ ] `docs/openspec.md`의 도메인/엔드포인트와 테이블 스키마가 일치하는지 재점검

<!-- harness:end -->
