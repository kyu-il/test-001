---
name: 'PAI: Help'
description: 'PAI 안내 — 명령어, 파이프라인, 핵심 파일 설명'
---

# PAI 안내

사용자에게 PAI(Plugin-based AI) 시스템을 안내합니다.

### PAI란?

PAI는 AI 개발을 5단계 파이프라인으로 구조화하는 빌드 오케스트레이터입니다.

### 파이프라인 5단계

```
Environment → Design → Execution → Validation → Evaluation
(환경 구성)   (설계)    (AI 코드생성)  (테스트/검증)  (품질 평가)
```

### 사용 가능한 명령어 (v0.11+)

| 명령어        | 설명            | 사용 시점                 |
| ------------- | --------------- | ------------------------- |
| `/pai help`   | 이 안내         | PAI가 뭔지 알고 싶을 때   |
| `/pai init`   | 프로젝트 초기화 | 새 프로젝트 시작 시       |
| `/pai status` | 상태 확인       | 설치 플러그인 점검        |
| `/pai check`  | 환경 점검       | Node/Git/Claude Code 검증 |
| `/pai design` | PRD/OMC 생성    | 설계 문서 관리            |
| `/pai test`   | 테스트·검증     | 코드 작성 후              |
| `/pai grade`  | 품질 평가       | 준비도 평가               |
| `/pai add`    | 플러그인 추가   | Production 확장           |

### 구 명령어 (v0.13 까지 유지)

`/pai info → help`, `/pai doctor → check`, `/pai validate → test`, `/pai evaluate → grade`, `/pai install → add`

### 핵심 파일

- `docs/openspec.md` — PRD, `.pai/omc.md` — 도메인 모델, `.pai/config.json` — PAI 설정, `CLAUDE.md` — AI 컨텍스트
