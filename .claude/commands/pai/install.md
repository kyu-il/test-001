---
name: 'PAI: Install'
description: '플러그인 추가 설치 — Mockup에서 Production 확장'
---

# PAI 플러그인 추가 설치

## 수행할 작업

### 1. 현재 설치 상태 확인

파일 존재 여부로 이미 설치된 플러그인을 파악하세요.

### 2. 미설치 항목 안내

이미 설치된 항목은 `(이미 설치됨)`으로, 미설치 항목만 선택 가능하게 안내하세요.

### 3. 사용자 선택에 따라 파일 생성

- **Vercel**: vercel.json
- **Supabase**: supabase/config.toml + .env.local 키
- **gstack**: .pai/gstack.json
- **Harness**: .pai/harness.json

### 4. .pai/config.json 업데이트

plugins 배열에 새 플러그인 추가

### 주의: 이미 존재하는 파일은 덮어쓰지 않음
