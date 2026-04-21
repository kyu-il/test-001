---
name: 'PAI: Design'
description: 'Ideation → PRD → 하네스 구성까지 심층 인터뷰 기반 설계'
---

# PAI 설계 — 심층 인터뷰 기반 파이프라인

## 세션 관리 원칙 (반드시 준수)

### Phase 전환 체크포인트

각 Phase가 완료될 때마다 다음 순서로 **반드시** 사용자에게 확인하세요:

```
✅ Phase N 완료.

[1] git commit 하시겠습니까?
    → 커밋 메시지 제안: "docs: ..."
[2] 다음 Phase(N+1)로 넘어가기 전에 /clear 로 컨텍스트를 초기화하시겠습니까?
    → 초기화하면 현재 대화는 사라지지만 파일은 유지됩니다.
    → 초기화 후 /pai design prd 또는 /pai design validate 로 재시작할 수 있습니다.
```

사용자가 **둘 다 원하지 않는다면** 바로 다음 Phase를 진행하세요.

### 컨텍스트 크기 경고

Phase 진행 중 대화가 길어졌다고 판단될 때 (메시지가 10개 이상이거나 인터뷰가 반복될 때):

```
⚠️  대화가 길어졌습니다. /compact 로 컨텍스트를 압축하시겠습니까?
    → 압축해도 작업 흐름은 유지됩니다.
```

> 이 두 가지 확인은 사용자가 맥락 관리를 놓치지 않도록 돕는 핵심 지침입니다. 절대 생략하지 마세요.

## 인자: $ARGUMENTS

- 인자 없음 → 전체 파이프라인 (Git Init → Ideation → PRD → 하네스)
- `ideation` → Ideation만 수행
- `prd` → PRD만 수행
- `validate` → 검증만 수행

---

## Phase 0: Git 저장소 초기화

**목표**: 설계 산출물을 버전 관리 아래에 두기

1. 현재 디렉토리에 `.git`이 있는지 확인 (`git status`)
2. `.git`이 없으면:
   ```bash
   git init
   git add .
   git commit -m "chore: initial commit"
   ```
3. `.git`이 이미 있으면 건너뛰고 사용자에게 알림

> 이 Phase는 인자와 무관하게 **항상 먼저 실행**하세요.

---

## Phase 1: Ideation (아이디어 구체화)

**목표**: 사용자의 머릿속 아이디어를 `docs/ideation.md`로 구체화

`docs/ideation.md`가 이미 존재하면 내용을 읽고 Phase 2로 넘어가세요.

없으면 AskUserQuestion 도구로 심층 인터뷰를 진행하세요:

1. "어떤 문제를 해결하고 싶으세요?" — 핵심 과제 파악
2. "이 서비스를 주로 사용할 사람은 누구인가요?" — 대상 사용자
3. "비슷한 서비스가 있다면 뭐가 다른가요?" — 차별점
4. "반드시 있어야 할 기능 3가지는?" — 핵심 기능
5. "언제까지 만들고 싶으세요?" — 일정 제약

답변을 종합하여 `docs/ideation.md`를 생성하세요.

**Phase 1 완료 후 커밋**:

```bash
git add docs/ideation.md
git commit -m "docs: add ideation — [프로젝트 한 줄 설명]"
```

---

## Phase 2: PRD 작성 (제품 요구사항)

**목표**: Ideation을 기반으로 `docs/openspec.md` PRD 작성

`docs/ideation.md`를 읽고, 부족한 맥락은 AskUserQuestion으로 보강:

1. "기술 스택 선호가 있으세요?" — 프레임워크/언어 제약
2. "외부 API 연동이 필요한가요?" — 의존성 파악
3. "데이터는 어떤 것을 저장해야 하나요?" — DB 스키마 힌트
4. "로그인/회원가입이 필요한가요?" — 인증 범위

답변을 종합하여 `docs/openspec.md` 5개 섹션을 작성:

- 목적 (Purpose)
- 사용자 (Users)
- 핵심 기능 (Features)
- 기술 스택 (Stack)
- API 엔드포인트

**Phase 2 완료 후 커밋**:

```bash
git add docs/openspec.md
git commit -m "docs: add openspec PRD — [프로젝트명]"
```

## Phase 2.5: MCP 서버 설계 (MCP 프로젝트만)

\`.pai/config.json\`의 \`mcp.enabled\`가 true이면 이 Phase를 수행하세요:

1. \`docs/openspec.md\`의 "## MCP 서버" 섹션을 찾아 현재 정의된 도구/리소스/프롬프트 목록 확인
2. TODO로 채워진 항목이 있으면 AskUserQuestion으로 심층 인터뷰:

   **Tools 서버 (tools / tools-public / all)**:
   - "이 MCP 서버에서 제공할 도구 이름과 기능은?"
   - "각 도구의 입력 파라미터(JSON Schema)는?"
   - "출력 형식(text/json/image)은?"
   - "내부 로직은 어디에 구현? (src/lib/ 또는 외부 API 호출?)"

   **Resources 서버 (resources / all)**:
   - "AI에게 제공할 컨텍스트는 무엇인가요?"
   - "각 리소스의 URI 스키마(예: \`wiki://pages/\`)는?"
   - "MIME 타입(text/plain, application/json)은?"

   **Prompts 서버 (prompts / all)**:
   - "재사용 프롬프트 이름과 용도는?"
   - "각 프롬프트에 필요한 인자는?"

3. 답변을 종합하여 \`openspec.md\`의 MCP 섹션 테이블을 채웁니다.

4. **공개 배포(tools-public)**인 경우 추가 질문:
   - "시간당 레이트 리밋을 변경할까요? (기본 100회/시간)"
   - "각 도구별 비용이 다르게 설계되나요?"
   - "대시보드에서 사용자에게 표시할 무료 한도는?"

5. MCP 서버의 \`src/tools.ts\`, \`src/resources.ts\` 등에 설계된 도구를 구현하도록 사용자에게 안내하세요.

## Phase 3: 기술 제약 + 하네스 엔지니어링

**목표**: AI 에이전트가 안전하게 작업할 수 있는 환경 확인

AskUserQuestion으로 기술적 제약 파악:

1. "기존에 사용 중인 DB나 서버가 있나요?" — 기존 인프라
2. "배포 환경은 어디인가요?" — 배포 제약
3. "팀에서 사용하는 코딩 규칙이 있나요?" — 스타일 제약

하네스 엔지니어링 확인:

- `CLAUDE.md` — AI 컨텍스트 충분한지 검증
- `.claude/settings.json` — 권한 설정 적절한지 확인
- 테스트 환경 — `tests/` 디렉토리 + 테스트 프레임워크 존재 확인
- 부족한 항목은 자동 생성 제안

## Phase 4: 검증 + 최종 커밋

모든 Phase 완료 후:

1. `docs/ideation.md` 존재 + 내용 확인
2. `docs/openspec.md` 5개 섹션 완성도 검증
3. `handoff.md` 업데이트 — 완료된 항목 체크, 다음 단계 갱신

**최종 커밋** (변경사항이 있을 경우):

```bash
git add -A
git commit -m "docs: complete design phase — ideation + PRD"
```

## 중요 원칙

- **추측 금지**: 컨텍스트가 부족하면 반드시 AskUserQuestion으로 질문
- **이미 존재하는 파일 덮어쓰지 않음** — 보강만 제안
- **각 Phase 완료 시 사용자에게 결과 요약** 보고
- **Git 커밋은 각 Phase 완료 직후** — 설계 이력 추적 가능하게
