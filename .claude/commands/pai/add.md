---
name: 'PAI: Add'
description: '플러그인 추가 설치 — Mockup에서 Production 확장'
---

# PAI 플러그인 추가 설치

기존 프로젝트에 추가 플러그인을 설치합니다. (Mockup → Production 확장)

### 1단계: 현재 설치 상태 스캔

| 플러그인 | 감지 경로           |
| -------- | ------------------- |
| GitHub   | `.git` / `.github`  |
| Vercel   | `vercel.json`       |
| Supabase | `supabase/`         |
| OpenSpec | `docs/openspec.md`  |
| OMC      | `.pai/omc.md`       |
| gstack   | `.pai/gstack.json`  |
| Harness  | `.pai/harness.json` |

### 2단계: 미설치 항목 체크박스로 사용자에게 제시

### 3단계: 선택된 플러그인 파일 생성

- **Vercel**: `vercel.json`
- **Supabase**: `supabase/config.toml` + `.env.local` (URL/KEY)
- **gstack**: `.pai/gstack.json` (testRunner, coverageThreshold 80%)
- **Harness**: `.pai/harness.json` (specFile, rules)

### 4단계: `.pai/config.json`의 `plugins` 배열에 추가

### 주의

이미 존재하는 파일은 절대 덮어쓰지 않음. `.env.local`은 append only.
