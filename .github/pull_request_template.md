## Summary

<!-- 이 PR이 어떤 변경을 하는지 1-3 bullet로. 관련 이슈/링크 포함. -->

## Change Type

<!-- 해당되는 항목 체크 -->

- [ ] Feature (신규 기능)
- [ ] Fix (버그 수정)
- [ ] Refactor (동작 변경 없음)
- [ ] Docs
- [ ] Chore / Infra

## Design Contract

<!-- harness → openspec / omc 계약 확인 -->

- [ ] `docs/openspec.md` 엔드포인트 테이블이 구현과 일치
- [ ] `.pai/omc.md` 도메인/비즈니스 규칙이 구현과 일치
- [ ] 신규 엔드포인트 추가 시 **openspec + omc 둘 다** 업데이트

## Test Plan

<!-- 어떻게 검증했는지 체크리스트 형식으로. 수동 확인 시 스크린샷 권장. -->

- [ ] `npm run lint` / `npm run typecheck` 통과
- [ ] `npm run test` 통과 (추가된 엔드포인트·규칙에 대한 테스트 포함)
- [ ] 로컬 수동 확인

## Supabase Migration Checklist

<!-- supabase/migrations/** 변경이 있는 경우에만 작성. 없으면 "N/A" -->

- [ ] `supabase db diff`로 SQL 미리보기 확인
- [ ] 마이그레이션은 idempotent (`IF NOT EXISTS` 등)
- [ ] 파괴적 변경이면 롤백 플랜 기재 — **롤백 절차**:
- [ ] RLS 정책 변경 시 `.pai/omc.md`의 팀 격리 규칙과 정합
- [ ] `docs/openspec.md`·`.pai/omc.md` 스키마 일치

## Deploy / Rollout

- [ ] 새 환경변수가 있으면 `.env.example` 동기화 및 Vercel 설정 반영 안내
- [ ] main/develop 직접 push 없음 — 브랜치 → PR 경로

---

🤖 리뷰 후 머지. `CLAUDE.md`의 Harness Rules (production) 준수.
