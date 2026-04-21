---
name: 'PAI: Info'
description: 'PAI 안내 — 명령어, 파이프라인, 핵심 파일 설명'
---

# PAI 안내

사용자에게 PAI(Plugin-based AI) 시스템을 안내합니다.

## 수행할 작업

아래 내용을 읽기 쉽게 사용자에게 설명하세요:

### PAI란?

PAI는 AI 개발을 5단계 파이프라인으로 구조화하는 빌드 오케스트레이터입니다.

### 파이프라인 5단계

```
Environment → Design → Execution → Validation → Evaluation
(환경 구성)   (설계)    (AI 코드생성)  (테스트/검증)  (품질 평가)
```

### 사용 가능한 명령어

| 명령어          | 설명            | 사용 시점               |
| --------------- | --------------- | ----------------------- |
| `/pai info`     | PAI 안내        | PAI가 뭔지 알고 싶을 때 |
| `/pai init`     | 프로젝트 초기화 | 새 프로젝트 시작 시     |
| `/pai status`   | 상태 확인       | 설치 상태 점검 시       |
| `/pai doctor`   | 환경 진단       | 환경 문제 점검 시       |
| `/pai design`   | PRD/OMC 생성    | 설계 문서 관리 시       |
| `/pai validate` | 테스트/검증     | 코드 작성 후            |
| `/pai evaluate` | 품질 평가       | 준비도 평가 시          |
| `/pai install`  | 플러그인 추가   | Production 확장 시      |

### 추천 시작 순서

1. **처음이라면** → `/pai init`
2. **PRD 작성** → `/pai design`
3. **코드 작성 후** → `/pai validate`
4. **품질 점검** → `/pai evaluate`
