# OfficeNEXT OAuth2 인증 연동 가이드

> **대상**: OfficeNEXT IdP를 통해 SSO 로그인을 연동하려는 서비스(RP, Relying Party) 개발자  
> **인증 방식**: OAuth 2.0 Authorization Code Grant  
> **기준 콜백 URL**: `http://localhost:3000/auth/callback`

---

## 목차

1. [사전 준비](#1-사전-준비)
2. [전체 인증 흐름 요약](#2-전체-인증-흐름-요약)
3. [Step 1 — 환경 설정](#3-step-1--환경-설정)
4. [Step 2 — 로그인 버튼에서 인증 요청](#4-step-2--로그인-버튼에서-인증-요청)
5. [Step 3 — Callback 처리 (Authorization Code 수신)](#5-step-3--callback-처리-authorization-code-수신)
6. [Step 4 — Access Token 교환](#6-step-4--access-token-교환)
7. [Step 5 — 사용자 정보 조회](#7-step-5--사용자-정보-조회)
8. [Step 6 — 로그인 완료 및 세션 생성](#8-step-6--로그인-완료-및-세션-생성)
9. [전체 구현 예시 (Node.js / Express)](#9-전체-구현-예시-nodejs--express)
10. [선택 — Client Credentials로 추가 정보 조회](#10-선택--client-credentials로-추가-정보-조회)
11. [보안 체크리스트](#11-보안-체크리스트)
12. [트러블슈팅](#12-트러블슈팅)

---

## 1. 사전 준비

OfficeNEXT IdP 관리자에게 서비스 등록을 요청하여 아래 정보를 발급받습니다.

| 항목            | 설명                                                                 |
| --------------- | -------------------------------------------------------------------- |
| `client_id`     | IdP에 등록된 서비스 식별자                                           |
| `client_secret` | 토큰 교환 시 사용하는 비밀 키                                        |
| `IdP Host`      | OfficeNEXT IdP 서버 주소 (예: `https://api.officenext.net`)          |
| `redirect_uri`  | IdP에 등록된 콜백 URL — 기본값 `http://localhost:3000/auth/callback` |

> **중요**: `redirect_uri`는 IdP에 사전 등록된 값과 정확히 일치해야 합니다. 운영 환경에서는 HTTPS 주소로 변경하고, IdP 관리자에게 해당 URL 등록을 요청하세요.

---

## 2. 전체 인증 흐름 요약

```
사용자(브라우저)          서비스(RP)               OfficeNEXT IdP
     │                      │                          │
     │  1. "오피스넥스트로    │                          │
     │     로그인" 클릭      │                          │
     │─────────────────────>│                          │
     │                      │  2. /oauth/authorize      │
     │                      │     리다이렉트 생성        │
     │<─────────────────────│                          │
     │  3. IdP 로그인 페이지로 이동                      │
     │─────────────────────────────────────────────────>│
     │                      │                          │
     │  4. 사용자 로그인/동의  │                         │
     │                      │                          │
     │  5. callback?code=xxx&state=yyy                  │
     │<────────────────────────────────────────────────│
     │─────────────────────>│                          │
     │                      │  6. POST /oauth/token     │
     │                      │     (code → access_token) │
     │                      │─────────────────────────>│
     │                      │  7. access_token 응답     │
     │                      │<─────────────────────────│
     │                      │  8. GET /api/user         │
     │                      │     (사용자 정보 조회)     │
     │                      │─────────────────────────>│
     │                      │  9. 사용자 정보 응답       │
     │                      │<─────────────────────────│
     │  10. 로그인 완료       │                          │
     │     (세션 생성)        │                          │
     │<─────────────────────│                          │
```

---

## 3. Step 1 — 환경 설정

`.env` 파일에 아래 값들을 설정합니다. **절대 소스코드에 직접 하드코딩하지 마세요.**

```env
# OfficeNEXT OAuth2 설정
OFFICENEXT_HOST=https://api.officenext.net
OFFICENEXT_CLIENT_ID=your_client_id_here
OFFICENEXT_CLIENT_SECRET=your_client_secret_here
OFFICENEXT_REDIRECT_URI=http://localhost:3000/auth/callback
OFFICENEXT_SCOPE=web
```

> `OFFICENEXT_HOST`는 자사 IdP 서버 주소에 맞게 수정합니다.  
> `OFFICENEXT_REDIRECT_URI`는 IdP에 등록된 콜백 주소와 정확히 일치해야 합니다.

---

## 4. Step 2 — 로그인 버튼에서 인증 요청

"오피스넥스트로 로그인" 버튼 클릭 시, 아래 URL로 브라우저를 리다이렉트합니다.

### 요청 형식

```
GET {OFFICENEXT_HOST}/oauth/authorize
    ?response_type=code
    &client_id={OFFICENEXT_CLIENT_ID}
    &redirect_uri={OFFICENEXT_REDIRECT_URI}
    &scope=web
    &state={RANDOM_STRING_40}
```

### 파라미터 설명

| 파라미터        | 필수 | 설명                                                              |
| --------------- | ---- | ----------------------------------------------------------------- |
| `response_type` | O    | 고정값 `code` (Authorization Code 방식)                           |
| `client_id`     | O    | IdP에서 발급받은 클라이언트 ID                                    |
| `redirect_uri`  | O    | IdP에 등록된 콜백 URL                                             |
| `scope`         | O    | 권한 범위 — `web`                                                 |
| `state`         | O    | CSRF 방지용 랜덤 문자열 (40자 권장). 세션에 저장 후 콜백에서 검증 |

### 프론트엔드 구현 예시

```javascript
function handleOfficeNEXT() {
  // CSRF 방지를 위한 state 생성 및 세션 저장
  const state = generateRandomString(40);
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: 'YOUR_CLIENT_ID', // 환경설정에서 주입
    redirect_uri: 'http://localhost:3000/auth/callback',
    scope: 'web',
    state: state
  });

  // IdP 인증 페이지로 리다이렉트
  window.location.href = `https://api.officenext.net/oauth/authorize?${params.toString()}`;
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}
```

---

## 5. Step 3 — Callback 처리 (Authorization Code 수신)

사용자가 IdP에서 로그인을 완료하면, IdP는 등록된 `redirect_uri`로 아래와 같이 리다이렉트합니다.

```
GET http://localhost:3000/auth/callback
    ?code=AUTHORIZATION_CODE
    &state=ORIGINAL_STATE_VALUE
```

### 콜백에서 확인할 사항

1. `state` 값이 요청 시 저장한 값과 일치하는지 확인 (CSRF 방지)
2. `error` 파라미터가 있는지 확인 (인증 거부 또는 오류)
3. `code` 값을 추출하여 토큰 교환에 사용

---

## 6. Step 4 — Access Token 교환

수신한 Authorization Code를 사용하여 Access Token을 요청합니다.

### 요청 형식

```
POST {OFFICENEXT_HOST}/oauth/token
Content-Type: application/x-www-form-urlencoded

client_id={OFFICENEXT_CLIENT_ID}
&client_secret={OFFICENEXT_CLIENT_SECRET}
&code={AUTHORIZATION_CODE}
&grant_type=authorization_code
&redirect_uri={OFFICENEXT_REDIRECT_URI}
```

### 파라미터 설명

| 파라미터        | 필수 | 설명                                       |
| --------------- | ---- | ------------------------------------------ |
| `client_id`     | O    | IdP에서 발급받은 클라이언트 ID             |
| `client_secret` | O    | 클라이언트 시크릿 (서버 사이드에서만 사용) |
| `code`          | O    | 콜백에서 수신한 Authorization Code         |
| `grant_type`    | O    | 고정값 `authorization_code`                |
| `redirect_uri`  | O    | 인증 요청 시 사용한 것과 동일한 콜백 URI   |

### 응답 예시

```json
{
  "access_token": "your_access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "your_refresh_token"
}
```

> **주의**: `client_secret`은 반드시 서버 사이드에서만 사용해야 합니다. 프론트엔드에 노출되면 보안 위험이 발생합니다.

---

## 7. Step 5 — 사용자 정보 조회

발급받은 Access Token으로 로그인한 사용자의 정보를 조회합니다.

### 요청

```
GET {OFFICENEXT_HOST}/api/user HTTP/1.1
Authorization: Bearer {access_token}
```

### 응답 예시

```json
{
  "id": 1,
  "group_id": 1,
  "account": "apitest@test.com",
  "code": null,
  "name": "apiTest",
  "email": "apitest@test.com",
  "tels": [],
  "mobiles": [],
  "jobposition": null,
  "profile_photo_url": "https://test.com/image/my_default.png",
  "profile_photo_hash": "0887860381c1f360e554a5cc3bb4eed3",
  "profile_photo_original_hash": "0887860381c1f360e554a5cc3bb4eed3",
  "is_use_default_photo": true,
  "is_required_password_change": true
}
```

### 주요 필드 설명

| 필드                | 설명               |
| ------------------- | ------------------ |
| `id`                | 사용자 고유 ID     |
| `group_id`          | 소속 그룹(회사) ID |
| `account`           | 로그인 계정        |
| `name`              | 사용자 이름        |
| `email`             | 이메일 주소        |
| `tels`              | 전화번호 목록      |
| `mobiles`           | 휴대폰 번호 목록   |
| `jobposition`       | 직책               |
| `profile_photo_url` | 프로필 사진 URL    |

---

## 8. Step 6 — 로그인 완료 및 세션 생성

사용자 정보를 정상적으로 받아왔다면, 서비스의 자체 세션을 생성하고 로그인을 완료합니다.

1. `/api/user` 응답에서 사용자 식별 정보(`id`, `account`, `email` 등)를 추출합니다.
2. 서비스 DB에 해당 사용자가 존재하는지 확인합니다. 없으면 신규 등록(프로비저닝)을 수행합니다.
3. 서비스 자체 세션(또는 JWT)을 생성합니다.
4. Access Token과 Refresh Token을 안전하게 저장합니다 (서버 세션 또는 암호화된 저장소).
5. 사용자를 서비스 메인 페이지로 리다이렉트합니다.

---

## 9. 전체 구현 예시 (Node.js / Express)

아래는 위 모든 단계를 포함한 실제 동작하는 서버 코드입니다.

### 패키지 설치

```bash
npm init -y
npm install express axios dotenv express-session crypto
```

### 디렉터리 구조

```
project/
├── .env
├── server.js
└── public/
    └── login.html    ← login_sample.html 기반
```

### .env

```env
OFFICENEXT_HOST=https://api.officenext.net
OFFICENEXT_CLIENT_ID=your_client_id_here
OFFICENEXT_CLIENT_SECRET=your_client_secret_here
OFFICENEXT_REDIRECT_URI=http://localhost:3000/auth/callback
OFFICENEXT_SCOPE=web
SESSION_SECRET=your_session_secret_here
```

### server.js

```javascript
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const session = require('express-session');

const app = express();
const PORT = 3000;

// ─── 환경 변수 ───
const {
  OFFICENEXT_HOST,
  OFFICENEXT_CLIENT_ID,
  OFFICENEXT_CLIENT_SECRET,
  OFFICENEXT_REDIRECT_URI,
  OFFICENEXT_SCOPE,
  SESSION_SECRET
} = process.env;

// ─── 세션 설정 ───
app.use(
  session({
    secret: SESSION_SECRET || 'fallback-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // 운영 환경에서는 true (HTTPS 필수)
  })
);

app.use(express.static('public'));

// ─── [Step 2] 인증 요청 — 로그인 버튼 클릭 시 호출 ───
app.get('/auth/login', (req, res) => {
  // CSRF 방지용 state 생성 (40자 랜덤 문자열)
  const state = crypto.randomBytes(20).toString('hex'); // 40자
  req.session.oauthState = state;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OFFICENEXT_CLIENT_ID,
    redirect_uri: OFFICENEXT_REDIRECT_URI,
    scope: OFFICENEXT_SCOPE || 'web',
    state: state
  });

  const authorizeUrl = `${OFFICENEXT_HOST}/oauth/authorize?${params.toString()}`;
  res.redirect(authorizeUrl);
});

// ─── [Step 3~6] 콜백 처리 — IdP에서 리다이렉트 후 도착 ───
app.get('/auth/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // 에러 처리
  if (error) {
    console.error('OAuth 인증 오류:', error);
    return res.redirect('/login.html?error=auth_denied');
  }

  // [Step 3] state 검증 (CSRF 방지)
  if (!state || state !== req.session.oauthState) {
    console.error('State 불일치 — CSRF 공격 의심');
    return res.redirect('/login.html?error=invalid_state');
  }

  // state 사용 후 삭제
  delete req.session.oauthState;

  if (!code) {
    return res.redirect('/login.html?error=no_code');
  }

  try {
    // ─── [Step 4] Access Token 교환 ───
    const tokenResponse = await axios.post(
      `${OFFICENEXT_HOST}/oauth/token`,
      new URLSearchParams({
        client_id: OFFICENEXT_CLIENT_ID,
        client_secret: OFFICENEXT_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: OFFICENEXT_REDIRECT_URI
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // ─── [Step 5] 사용자 정보 조회 ───
    const userResponse = await axios.get(`${OFFICENEXT_HOST}/api/user`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userResponse.data;

    // ─── [Step 6] 세션 생성 및 로그인 완료 ───
    req.session.user = {
      id: user.id,
      groupId: user.group_id,
      account: user.account,
      name: user.name,
      email: user.email,
      profilePhoto: user.profile_photo_url
    };
    req.session.tokens = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000
    };

    console.log(`로그인 성공: ${user.name} (${user.email})`);

    // 서비스 메인 페이지로 이동
    res.redirect('/');
  } catch (err) {
    console.error('OAuth 처리 오류:', err.response?.data || err.message);
    res.redirect('/login.html?error=token_exchange_failed');
  }
});

// ─── 로그인 상태 확인 API ───
app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.session.user);
});

// ─── 로그아웃 ───
app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// ─── 인증 미들웨어 (보호된 라우트에 사용) ───
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

// ─── 메인 페이지 (로그인 필요) ───
app.get('/', requireAuth, (req, res) => {
  const user = req.session.user;
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head><meta charset="UTF-8"><title>메인</title></head>
    <body>
      <h1>환영합니다, ${user.name}님!</h1>
      <p>이메일: ${user.email}</p>
      <p>계정: ${user.account}</p>
      <a href="/auth/logout">로그아웃</a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`서버 시작: http://localhost:${PORT}`);
  console.log(`로그인 페이지: http://localhost:${PORT}/login.html`);
});
```

### login.html 수정 포인트

기존 `login_sample.html`에서 `handleOfficeNEXT()` 함수를 아래와 같이 변경합니다.

```javascript
function handleOfficeNEXT() {
  // 서버 사이드에서 state 생성 및 리다이렉트를 처리
  window.location.href = '/auth/login';
}
```

> 프론트엔드에서 직접 IdP URL을 구성하지 않고, 서버(`/auth/login`)를 경유하는 것이 보안상 안전합니다. `client_id` 노출을 최소화하고 `state` 관리를 서버에서 일원화할 수 있습니다.

---

## 10. 선택 — Client Credentials로 추가 정보 조회

> **이 섹션은 선택 사항입니다.** 회사 정보나 조직도 동기화 등 추가 데이터가 필요한 경우에만 구현합니다.

Client Credentials 방식은 사용자 개입 없이 서비스 자체 인증으로 API를 호출하는 방식입니다.

### 10-1. Client Credentials 토큰 발급

```
POST {OFFICENEXT_HOST}/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={OFFICENEXT_CLIENT_ID}
&client_secret={OFFICENEXT_CLIENT_SECRET}
```

### 10-2. 회사 정보 조회 API

```
GET {OFFICENEXT_HOST}/api/groups/158 HTTP/1.1
Authorization: Bearer {client_credentials_access_token}
```

**응답 예시:**

```json
{
  "id": 1,
  "code": "group_code",
  "name": "group_name",
  "registration_number": "111-11-11111",
  "ceo_name": null,
  "ceo_email": "test@test.com",
  "managers": {
    "senior_manager_name": null,
    "general_manager_name": null,
    "senior_manager_email": "b@cdef.com",
    "senior_manager_phone": "234-123-2345"
  }
}
```

### 10-3. 조직 정보 조회 (동기화) API

```
GET {OFFICENEXT_HOST}/api/groups/158/organization HTTP/1.1
Authorization: Bearer {client_credentials_access_token}
```

**응답 예시:**

```json
{
  "max_revision": 196,
  "users": [
    {
      "id": 1,
      "group_id": 1,
      "account": "jiran@jiran.com",
      "code": "JR2022001",
      "name": "김지란",
      "email": "jiran@jiran.com",
      "tels": ["02-0000-0000", "02-1111-1111"],
      "mobiles": ["010-0000-0000"]
    }
  ]
}
```

### 10-4. 구현 예시 (Node.js)

```javascript
// Client Credentials 토큰 발급 함수
async function getClientCredentialsToken() {
  const response = await axios.post(
    `${OFFICENEXT_HOST}/oauth/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: OFFICENEXT_CLIENT_ID,
      client_secret: OFFICENEXT_CLIENT_SECRET
    }).toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data.access_token;
}

// 회사 정보 조회
async function getGroupInfo() {
  const token = await getClientCredentialsToken();
  const response = await axios.get(`${OFFICENEXT_HOST}/api/groups/158`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// 조직 정보 조회 (동기화)
async function getOrganizationInfo() {
  const token = await getClientCredentialsToken();
  const response = await axios.get(`${OFFICENEXT_HOST}/api/groups/158/organization`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
```

> **참고**: `group_id`는 `158`로 고정 사용합니다. URL 경로에 반드시 이 값을 사용하세요.

---

## 11. 보안 체크리스트

| 항목                      | 설명                                        | 확인 |
| ------------------------- | ------------------------------------------- | ---- |
| `client_secret` 서버 보관 | 프론트엔드에 절대 노출 금지                 | [ ]  |
| `state` 파라미터 검증     | 콜백 수신 시 세션에 저장된 값과 반드시 비교 | [ ]  |
| HTTPS 적용                | 운영 환경에서 반드시 HTTPS 사용             | [ ]  |
| `redirect_uri` 고정       | IdP에 등록된 URI만 허용, 동적 변경 금지     | [ ]  |
| Token 안전 저장           | 서버 세션 또는 암호화된 저장소에 보관       | [ ]  |
| Token 만료 처리           | `expires_in` 기반으로 자동 갱신 로직 구현   | [ ]  |
| `.env` 파일 Git 제외      | `.gitignore`에 `.env` 추가                  | [ ]  |

---

## 12. 트러블슈팅

### "redirect_uri_mismatch" 오류

`redirect_uri`가 IdP에 등록된 값과 정확히 일치하지 않을 때 발생합니다. 프로토콜(`http`/`https`), 포트, 경로, 후행 슬래시(`/`)까지 모두 확인하세요.

### "invalid_grant" 오류

Authorization Code는 일회성이며 만료 시간이 매우 짧습니다(보통 수십 초~수 분). 코드 수신 즉시 토큰 교환을 수행해야 합니다. 이미 사용된 코드를 재사용해도 이 오류가 발생합니다.

### "invalid_client" 오류

`client_id` 또는 `client_secret`이 올바르지 않습니다. `.env` 파일의 값을 다시 확인하세요.

### 콜백 페이지가 열리지 않음

서버가 `http://localhost:3000`에서 실행 중인지 확인하세요. `/auth/callback` 라우트가 등록되어 있는지 확인하세요.

### CORS 오류

토큰 교환은 반드시 서버 사이드에서 수행해야 합니다. 브라우저에서 직접 IdP의 `/oauth/token`을 호출하면 CORS 오류가 발생할 수 있습니다.

---

> **이 문서는 OfficeNEXT IdP OAuth2 연동을 위한 기술 가이드입니다.**  
> IdP 서버 주소, 클라이언트 키, 콜백 URL은 실제 환경에 맞게 수정하여 사용하세요.
