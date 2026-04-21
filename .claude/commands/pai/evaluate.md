---
name: 'PAI: Evaluate'
description: '6카테고리 가중 점수 기반 AI 개발 준비도 평가'
---

# PAI 품질 평가

## 수행할 작업

6카테고리별로 파일 존재 여부와 설정 품질을 확인하고 0~100점으로 채점하세요.

### [필수] 1. 테스트 커버리지 (20%)

테스트 프레임워크 설정, 테스트 디렉토리, 커버리지 설정 확인

### [필수] 2. CI/CD (20%)

.github/workflows, .gitlab-ci.yml 등 파이프라인 설정 확인

### [필수] 3. 훅 기반 검증 (20%)

.husky, lint-staged, .claude/settings.json 훅 확인

### [선택] 4. 리포지토리 구조 (13.3%)

src/ 조직, 의존성 관리, .gitignore 확인

### [선택] 5. 문서화 수준 (13.3%)

README.md, CONTRIBUTING.md, docs/ 확인

### [선택] 6. 하네스 엔지니어링 (13.4%)

CLAUDE.md, AGENTS.md, .claude/ 설정 확인

### 점수 계산

종합 점수 = 가중 평균, 등급: A(90+) B(80+) C(70+) D(50+) F(<50)
**페널티**: 필수 카테고리 F시 전체 최대 C

각 카테고리별 개선 권고사항을 구체적으로 제시하세요.
