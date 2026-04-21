---
name: 'PAI: SaveToken'
description: 'AI 토큰 절감 분석 — API 호출 스캔, 대체 코드 생성, 절감 리포트'
---

# PAI SaveToken — AI 토큰 절감 분석

## 담당자 표시 (반드시 출력)

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 PAI > SaveToken
담당: savetoken (토큰 절감 분석)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

## 수행할 작업

### Phase 0: .claude/settings.json 토큰 절감 설정 검토

\`.claude/settings.json\` 파일을 읽고 아래 3가지 설정 항목을 확인하세요:

| 항목                           | 권장값       | 이유                                              |
| ------------------------------ | ------------ | ------------------------------------------------- |
| \`model\`                      | \`"sonnet"\` | Opus 대신 Sonnet을 기본 모델로 사용해 비용 절감   |
| \`MAX_THINKING_TOKENS\`        | \`10000\`    | 내부 추론 토큰을 제한해 불필요한 소모 방지        |
| \`CLAUDE_CODE_SUBAGENT_MODEL\` | \`"haiku"\`  | 단순 작업 서브에이전트에 Haiku 사용으로 비용 절감 |

**항목이 없거나 다른 값이면** AskUserQuestion으로 확인하세요:

\`\`\`
⚙️ .claude/settings.json에 토큰 절감에 도움이 되는 설정이 빠져 있습니다.

누락 항목:
✗ model: "sonnet"
→ Opus 대신 Sonnet을 기본 모델로 사용해 응답 품질을 유지하면서 비용을 절감합니다.
✗ MAX_THINKING_TOKENS: 10000
→ Claude의 내부 추론(thinking) 토큰을 10,000으로 제한합니다.
무제한으로 두면 단순 질문에도 과도한 추론이 발생할 수 있습니다.
✗ CLAUDE_CODE_SUBAGENT_MODEL: "haiku"
→ 파일 읽기, 검색 등 단순 서브에이전트 작업에 Haiku를 사용합니다.
Sonnet 대비 비용이 약 80% 저렴합니다.

이 설정을 .claude/settings.json에 추가하시겠습니까?
\`\`\`

사용자가 **동의하면** 해당 항목만 settings.json에 추가하세요 (이미 있는 항목은 건드리지 않음).
사용자가 **거부하면** 이유를 묻지 말고 Phase 1로 넘어가세요.

---

### Phase 1: 스캔

1. 먼저 CLI 스캔 리포트가 있는지 확인하세요:
   \`\`\`bash
   cat .pai/savetoken-report.md 2>/dev/null
   \`\`\`
   없으면 먼저 실행: \`npx pai-zero savetoken\`

2. 프로젝트 전체에서 아래 패턴을 검색하세요:
   - AI SDK 임포트: \`@anthropic-ai/sdk\`, \`openai\`, \`@google/generative-ai\`, \`langchain\`
   - API 호출: \`messages.create\`, \`chat.completions.create\`, \`generateContent\`
   - Fetch: \`api.anthropic.com\`, \`api.openai.com\`

### Phase 2: 각 호출 심층 분석

발견된 각 API 호출에 대해:

1. **목적 파악**: 이 호출이 무엇을 하는지 분석
2. **프롬프트 분석**: 시스템 프롬프트와 사용자 프롬프트 내용 확인
3. **입출력 패턴**: 입력 데이터 형태와 기대 출력 형태 파악
4. **대체 가능성 판단**: 아래 기준으로 분류

### Phase 3: 영향도 분류 및 대체 전략

#### 🟢 영향도 낮음 — 즉시 대체 가능 (예상 절감: 해당 호출 100%)

- 텍스트 포맷팅/변환 → \`regex\`, \`string.replace()\`
- 데이터 유효성 검증 → \`zod\`, \`joi\`, JSON schema
- 템플릿 기반 생성 → \`handlebars\`, 문자열 템플릿
- 고정 카테고리 분류 → \`switch-case\`, lookup table
- 설정 파일 생성 → 템플릿 + 변수 치환

**대체 코드를 직접 작성**하여 \`.pai/savetoken/\` 디렉토리에 저장하세요.

#### 🟡 영향도 중간 — 검토 후 대체 (예상 절감: 해당 호출 50-80%)

- 텍스트 요약 → extractive 방식 (키워드 빈도 기반)
- 간단한 분류 → TF-IDF, 키워드 매칭, 규칙 기반
- 구조화된 데이터 추출 → regex, AST parser
- 반복적 번역 → i18n 파일 + 사전

**대체 로직의 의사코드**를 작성하고 구현 난이도를 평가하세요.

#### 🔴 영향도 높음 — AI 필수 (프롬프트 최적화로 절감)

- 코드 생성/리팩토링 → 프롬프트 캐싱, few-shot 최적화
- 복잡한 추론/분석 → 프롬프트 압축, 컨텍스트 정리
- 창의적 콘텐츠 생성 → 프롬프트 재설계
- 멀티턴 대화 → 턴 수 최소화

**프롬프트 최적화 방안**을 제시하세요.

### Phase 4: 리포트 생성

\`.pai/savetoken/\` 디렉토리에 다음을 저장:

1. \`analysis.md\` — 전체 분석 리포트
   - 호출별 목적, 영향도, 대체 전략
   - 총 예상 절감률 (%)
   - 단계별 추진 로드맵
2. \`replacements/\` — 대체 코드 파일들 (영향도 낮음)
3. \`optimizations.md\` — 프롬프트 최적화 제안 (영향도 높음)

## 리포트 형식

\`\`\`markdown

# SaveToken 분석 결과

## 요약

- 총 API 호출: N건
- 대체 가능: M건 (영향도 낮음 X건, 중간 Y건)
- AI 필수: Z건
- **예상 토큰 절감: ~XX%**

## 단계별 추진 전략

### 1단계: 즉시 적용 (영향도 낮음)

영향도, 파일, 현재 방식, 대체 방식, 예상 절감

### 2단계: 검토 후 적용 (영향도 중간)

...

### 3단계: 프롬프트 최적화 (영향도 높음)

...
\`\`\`

## 주의사항

- 대체 코드는 기존 입출력 인터페이스를 유지해야 합니다
- 영향도 중간 이상은 반드시 테스트와 함께 적용하세요
- AI 호출이 필수인 경우, 프롬프트 캐싱(prompt caching)이 가장 효과적입니다
