# Contributing to test-001

이 프로젝트에 기여해 주셔서 감사합니다.

## 개발 환경 설정

```bash
git clone <repo-url>
cd test-001
npm install
```

## 브랜치 규칙

- `main` — 안정 버전
- `feat/<기능명>` — 새 기능 개발
- `fix/<이슈번호>` — 버그 수정

## 커밋 메시지

```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 리팩토링
test: 테스트 추가/수정
```

## PR 프로세스

1. 브랜치 생성 → 작업 → 커밋
2. `npm test` 로 테스트 통과 확인
3. PR 생성 — 변경 사항 요약 작성
4. 리뷰 후 머지

## AI 협업 규칙

- `CLAUDE.md` 를 읽고 프로젝트 컨텍스트를 파악하세요
- `/pai evaluate` 로 AI 준비도를 확인하세요
- 컨텍스트가 부족하면 추측하지 말고 질문하세요
