---
name: 'PAI: Check'
description: '개발 환경 점검 — Node.js, Git, Claude Code'
---

# PAI 환경 점검

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PAI > Environment Stage
   담당: check (환경 점검)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 점검 항목

1. **Node.js** — `node --version` (v20+)
2. **npm** — `npm --version`
3. **Git** — `git --version` + `git remote -v`
4. **Claude Code** — `CLAUDE.md`, `.claude/settings.json`, `~/.claude/settings.json`의 `enabledPlugins["oh-my-claudecode@omc"]`
5. **PAI 설정** — `.pai/config.json`, `.pai/omc.md`, `docs/openspec.md`

### Windows 추가 점검

- `Get-ExecutionPolicy` → RemoteSigned 이상
- `$env:HOME` 또는 `$env:USERPROFILE` 설정
- PowerShell 7 권장

### 결과 보고

각 항목 ✅/⚠️/❌ 표시 + 권장 조치 안내.
