---
name: pai
description: 'PAI(Plugin-based AI) 빌드 오케스트레이터 — AI 개발을 5단계 파이프라인으로 구조화'
argument-hint: '[init|help|status|check|design|test|grade|add|handoff|savetoken|wakeup]'
---

# PAI — Plugin-based AI 빌드 오케스트레이터

사용자가 `/pai` 또는 `/pai <명령>`을 입력하면 아래 프로세스를 수행하세요.

## 명령어 라우팅 (v0.11+)

사용자의 입력에 따라 적절한 작업을 수행하세요:

- `/pai` 또는 `/pai help` → **안내 모드**: 명령어 목록, 파이프라인 설명, 시작 가이드 표시
- `/pai init` → **초기화 모드**: 프로젝트 분석 → 사용자 인터뷰 → 파일 생성
- `/pai status` → **상태 확인**: 플러그인 설치 상태 스캔 및 보고
- `/pai check` → **환경 점검**: Node.js, Git, Claude Code 환경 점검
- `/pai design` → **설계 관리**: OpenSpec/OMC 템플릿 생성 + PRD 완성도 검증
- `/pai test` → **테스트·검증**: 테스트 실행 + 하네스(설계↔구현) 검증
- `/pai grade` → **품질 평가**: 6카테고리 가중 점수 평가
- `/pai add` → **플러그인 추가**: Mockup → Production 확장
- `/pai savetoken` → **토큰 절감**: AI API 호출 분석 + 스크립트 대체 + 절감 리포트
- `/pai wakeup` → **웨이크업**: Claude Code 세션 자동 시작 + 토큰 윈도우 리셋

### 구 명령어 호환 (v0.13 까지 유지)

`/pai info` → help, `/pai doctor` → check, `/pai validate` → test, `/pai evaluate` → grade, `/pai install` → add

각 명령의 상세 지침은 `.claude/commands/pai/` 디렉토리에 있습니다.
해당 파일을 읽고 지시에 따라 수행하세요.

## 파이프라인 5단계

```
Environment → Design → Execution → Validation → Evaluation
(환경 구성)   (설계)    (AI 코드생성)  (테스트/검증)  (품질 평가)
```

## 핵심 원칙

1. **이미 존재하는 파일은 덮어쓰지 않음** — 건너뛰고 안내
2. **컨텍스트 격리** — 각 파이프라인 단계는 독립적으로 수행
3. **사용자 친화적** — 결과를 명확히 보고하고 다음 단계를 안내
4. **PRD 시작 가능 상태가 목표** — 설치 후 `docs/openspec.md`로 안내

## 품질 평가 기준 (evaluate)

| 카테고리          | 분류 | 가중치 |
| ----------------- | ---- | ------ |
| 테스트 커버리지   | 필수 | 20%    |
| CI/CD             | 필수 | 20%    |
| 훅 기반 검증      | 필수 | 20%    |
| 리포지토리 구조   | 선택 | 13.3%  |
| 문서화 수준       | 선택 | 13.3%  |
| 하네스 엔지니어링 | 선택 | 13.4%  |

등급: A(90+), B(80+), C(70+), D(50+), F(<50)
페널티: 필수 카테고리 F등급 시 전체 등급 최대 C로 제한
