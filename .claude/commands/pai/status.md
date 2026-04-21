---
name: 'PAI: Status'
description: '현재 프로젝트의 PAI 플러그인 설치 상태 확인'
---

# PAI 프로젝트 상태 확인

## 수행할 작업

다음 파일/디렉토리 존재 여부를 확인하고 상태를 보고하세요:

| 확인 경로               | 플러그인    |
| ----------------------- | ----------- |
| `.git` 또는 `.github`   | GitHub      |
| `vercel.json`           | Vercel      |
| `supabase/`             | Supabase    |
| `docs/openspec.md`      | OpenSpec    |
| `.pai/omc.md`           | OMC         |
| `.pai/gstack.json`      | gstack      |
| `.pai/harness.json`     | Harness     |
| `CLAUDE.md`             | AI 컨텍스트 |
| `.claude/settings.json` | AI 설정     |
| `.pai/config.json`      | PAI Core    |

`package.json`에서 스택도 감지하세요.

보고 형식:

```
프로젝트 상태
─────────────
스택: TypeScript, React
모드: production

  ✅ GitHub — 설치됨
  ✅ OpenSpec — 설치됨
  ⚠️ gstack — 미설치
```
