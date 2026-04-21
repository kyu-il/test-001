---
name: 'PAI: Doctor'
description: '개발 환경 진단 — Node.js, Git, Claude Code 점검'
---

# PAI 환경 진단

## 수행할 작업

다음 항목을 점검하세요:

1. **Node.js 버전**: `node --version` (v20 이상 필요)
2. **패키지 매니저**: `npm --version`
3. **Git 상태**: `git --version`, `git remote -v`
4. **Claude Code 파일**: CLAUDE.md, .claude/settings.json, .claude/skills/ 존재 여부
5. **PAI 설정**: .pai/config.json 내용 확인

보고 형식:

```
PAI Doctor — 환경 진단
══════════════════════
  ✅ Node.js v20.11.0 (>=20 OK)
  ✅ Git 2.43.0
  ⚠️ .claude/settings.json 없음
  → /pai init 으로 생성하세요
```
