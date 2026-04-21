---
name: recipes
description: '사내 시스템 연동 레시피 — 메신저 챗봇 (Office Chat)'
---

# 사내 시스템 연동 레시피

이 프로젝트에는 다음 사내 연동 레시피가 설치되어 있습니다.
관련 요청을 받으면 해당 경로의 `guideline.md`를 **반드시 먼저 읽고**
지침에 맞게 구현하세요.

## 트리거

- 메신저 챗봇 / 알림 봇 / Office Chat 연동 구현 시 이 레시피 문서를 우선 참조

## 설치된 레시피

### 메신저 챗봇 (Office Chat)

- 경로: `docs/recipes/officechat/`
- 주요 문서: `docs/recipes/officechat/guideline.md`
- 환경변수: `OFFICECHAT_HOST`, `OFFICECHAT_TOKEN`, `OFFICECHAT_CHANNEL`

## 작업 순서

1. 사용자의 요청이 위 트리거 중 하나에 해당하는지 판단
2. 해당 레시피의 `guideline.md`를 Read 도구로 읽기
3. 샘플 코드(`*.html`, `*.ts` 등)가 있으면 함께 확인
4. `.env.local`에 관련 환경변수가 채워져 있는지 확인
5. 가이드 순서에 따라 구현 — 레시피 규칙을 절대 우회하지 말 것
