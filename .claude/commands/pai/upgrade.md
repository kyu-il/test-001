---
name: 'PAI: Upgrade'
description: 'PAI 슬래시 커맨드 & 스킬을 최신 버전으로 업그레이드'
---

# PAI 업그레이드

## 담당자 표시 (반드시 출력)

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PAI > Environment Stage
담당: upgrade (시스템 파일 갱신)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

## 수행할 작업

터미널에서 다음 명령을 실행하세요:
\`\`\`bash
npx pai-zero upgrade
\`\`\`

강제 업그레이드 (이미 최신이어도):
\`\`\`bash
npx pai-zero upgrade --force
\`\`\`

### 주의사항

- 슬래시 커맨드와 SKILL.md는 최신으로 덮어씁니다.
- 프로젝트 파일(openspec.md, omc.md, CLAUDE.md)은 건드리지 않습니다.
