---
name: 'PAI: Init'
description: '프로젝트 초기화 — 분석, 인터뷰, 환경 파일 생성'
---

# PAI 프로젝트 초기화

이 프로젝트에 PAI(Plugin-based AI) 환경을 구축합니다.

## 수행할 작업

### 1단계: 프로젝트 분석

현재 작업 디렉토리를 분석하세요:

- `package.json` 존재 여부 → 언어/프레임워크 감지
- `tsconfig.json` → TypeScript 여부
- `.git` → Git 초기화 여부
- `.pai/config.json` → 이미 PAI 초기화된 프로젝트인지 (있으면 `/pai status` 안내)

분석 결과를 사용자에게 요약해 주세요.

### 2단계: 사용자 인터뷰

사용자에게 다음을 질문하세요:

1. **프로젝트명** (현재 폴더명을 기본값으로 제안)
2. **프로젝트 목적**: Mockup(프로토타입) vs Production(실서비스)
3. **인증 방식** (필요 시): Google/Naver/Kakao OAuth2, 사내 인증, 없음

### 3단계: 파일 생성

사용자 답변에 따라 다음 파일을 생성하세요:

**필수 (Mockup + Production):**

- `docs/openspec.md` — PRD 템플릿 (목적/사용자/기능/스택/API)
- `.pai/omc.md` — 도메인 객체 모델 템플릿
- `.pai/config.json` — PAI 설정
- `CLAUDE.md` — AI 컨텍스트
- `.gitignore`, `src/`, `docs/`, `tests/` 디렉토리

**Production 추가:**

- `.pai/gstack.json` — QA 설정 (커버리지 80%)
- `.pai/harness.json` — 검증 설정

### 4단계: 완료 안내

> 다음 단계: `docs/openspec.md`를 열어 PRD를 작성하세요.
> PRD 작성 후: `/pai design validate`로 완성도를 검증할 수 있습니다.

### 주의사항

- **이미 존재하는 파일은 덮어쓰지 마세요**
- **CLAUDE.md가 이미 있으면** `<pai>` 블록만 추가
