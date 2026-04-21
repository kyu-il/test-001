---
name: 'PAI: Validate'
description: '테스트 실행 + 하네스(설계↔구현 일치) 검증'
---

# PAI 검증

## 수행할 작업

### 1. 테스트 실행

```bash
npm test
```

결과를 보고하고, 실패 시 원인 설명 + 수정 제안.

### 2. 하네스 검증

`.pai/harness.json`이 있으면:

- `docs/openspec.md`의 API 엔드포인트가 `src/`에 구현되어 있는지 검증
- 테스트 디렉토리 존재 여부 확인

없으면: "Harness 미설정 — `/pai install`에서 추가 가능" 안내
