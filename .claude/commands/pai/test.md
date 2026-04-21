---
name: 'PAI: Test'
description: '테스트 실행 + 하네스(설계↔구현 일치) 검증'
---

# PAI 테스트·검증

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PAI > Validation Stage
   담당: gstack runner + harness checker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 1단계: 테스트 실행

- `.pai/gstack.json`의 `testRunner` 또는 `package.json`의 `scripts.test` 사용
- `npm test` 실행 후 결과 보고

### 2단계: 하네스 검증 (`.pai/harness.json` 존재 시)

- `spec-implementation-match`: OpenSpec 엔드포인트 ↔ 구현 매칭
- `api-contract-test`: 각 엔드포인트에 대한 테스트 존재 여부

### 3단계: 결과 보고 + 개선 제안

하네스 설정이 없으면 `/pai add`에서 Harness Engineering 선택 안내.
