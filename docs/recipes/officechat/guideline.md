# 오피스넥스트 메신저 알림 API 레퍼런스

> **문서 버전**: v1.0
> **최종 수정**: 2026-03-25
> **원본**: https://jiransoft.gitbook.io/adminmanual/serviceguide/messenger_api
> **목적**: MFA 서버에서 메신저 알림을 다양한 형태로 발송하기 위한 API 참고 문서

---

## 1. 개요

오피스넥스트 메신저의 Webhook 기반 REST API. 서비스 알림을 1:1, 다중, 전체 대상으로 발송할 수 있으며, 텍스트/카드/리스트/슬라이드 등 다양한 레이아웃을 지원한다.

### 엔드포인트

```
POST https://jiran-api.officewave.co.kr/api/v1/hooks/{token}/notifications
```

### 인증 방식

- **URL 경로에 토큰 포함** — 별도 Authorization 헤더 불필요
- 토큰 발급: 메신저 관리자 페이지 > 관리 > Webhook
- 관리 URL: https://admin.officewave.co.kr/managements/environment/webhook/

### Content-Type

```
Content-Type: application/json
```

---

## 2. 공통 필드

| 필드        | 타입         | 필수   | 설명                                                              |
| ----------- | ------------ | ------ | ----------------------------------------------------------------- |
| `whole`     | boolean      | X      | `true`: 전체 발송 (`to`는 빈 배열), `false`/생략: 특정 대상       |
| `to`        | string[]     | 조건부 | `whole=false`일 때 필수. 수신자 이메일 배열                       |
| `type`      | string       | X      | `default` (텍스트만), `static` (버튼 포함), `carousel` (슬라이드) |
| `template`  | string       | X      | `text`, `card`, `list`                                            |
| `important` | boolean      | X      | 중요 알림 표시 여부                                               |
| `contents`  | string       | 조건부 | `type=default`일 때 본문 (최대 1,000자)                           |
| `items`     | object/array | 조건부 | `type=static`일 때 object, `type=carousel`일 때 array             |

---

## 3. 메시지 타입별 상세

### 3.1 기본 텍스트 (`type: default`)

가장 단순. 버튼/링크 없이 텍스트만 발송.

```json
{
  "whole": false,
  "to": ["user@example.com"],
  "type": "default",
  "template": "text",
  "contents": "로그인이 완료되었습니다. IP: 203.0.113.1"
}
```

**MFA 활용**: 일반 로그인 성공 알림, 2FA 설정 변경 알림

---

### 3.2 버튼 텍스트형 (`type: static`, `template: text`)

헤더 + 본문 + 버튼(최대 3개) 구성.

```json
{
  "to": ["user@example.com"],
  "type": "static",
  "template": "text",
  "important": true,
  "items": {
    "header": "⚠ 새 디바이스에서 로그인 감지",
    "contents": "Chrome on macOS에서 로그인되었습니다.\nIP: 203.0.113.1 (Seoul, KR)\n시간: 2026-03-25 14:30",
    "buttons": [
      {
        "label": "보안 설정 확인",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      },
      {
        "label": "본인이 아닙니다",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      }
    ],
    "button_layout": "vertical"
  }
}
```

**MFA 활용**: 새 디바이스 로그인, 해외 IP 접근, 2FA 비활성화 등 보안 위협 알림

---

### 3.3 카드형 (`type: static`, `template: card`)

이미지 + 제목 + 본문 + 버튼.

```json
{
  "to": ["user@example.com"],
  "type": "static",
  "template": "card",
  "items": {
    "title": "보안 알림: 해외 접근 감지",
    "contents": "일본(Tokyo)에서 로그인 시도가 감지되었습니다.",
    "image_url": "https://dev-mfa.officenext.net/assets/security-alert.png",
    "buttons": [
      {
        "label": "보안 설정 확인",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      }
    ]
  }
}
```

**MFA 활용**: 크리티컬 보안 이벤트 (시각적 강조 필요 시)

---

### 3.4 리스트형 (`type: static`, `template: list`)

헤더 + 여러 항목(최대 5개) + 버튼.

```json
{
  "to": ["user@example.com"],
  "type": "static",
  "template": "list",
  "items": {
    "header": "📋 오늘의 보안 요약 (3건)",
    "items": [
      {
        "title": "로그인 성공",
        "contents": "Chrome on macOS — 09:15 (Seoul)",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      },
      {
        "title": "새 디바이스 감지",
        "contents": "Firefox on Windows — 11:30 (Seoul)",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      },
      {
        "title": "2FA 설정 변경",
        "contents": "SMS 인증 추가 — 14:00",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      }
    ],
    "buttons": [
      {
        "label": "전체 이력 보기",
        "type": "link",
        "href": "https://dev-mfa.officenext.net/mfa/manage"
      }
    ]
  }
}
```

**MFA 활용**: Phase C 매일 아침 9시 요약 보고 (알림 3단계 중 "기본")

---

### 3.5 슬라이드형 (`type: carousel`)

여러 카드/텍스트/리스트를 좌우 스와이프로 탐색.

```json
{
  "to": ["user@example.com"],
  "type": "carousel",
  "template": "card",
  "items": [
    {
      "title": "로그인 이력",
      "contents": "오늘 3회 로그인\n새 디바이스 1건",
      "image_url": "https://example.com/login-icon.png",
      "buttons": [{ "label": "상세 보기", "type": "link", "href": "..." }]
    },
    {
      "title": "보안 상태",
      "contents": "TOTP 활성\n복구코드 8/10 남음",
      "image_url": "https://example.com/security-icon.png",
      "buttons": [{ "label": "설정 변경", "type": "link", "href": "..." }]
    }
  ]
}
```

**MFA 활용**: 주간 보안 리포트, 대시보드 요약

---

## 4. 발송 대상

| 방식 | 설정                               | 사용 사례                       |
| ---- | ---------------------------------- | ------------------------------- |
| 1:1  | `"to": ["user@example.com"]`       | 개인 보안 알림                  |
| 다중 | `"to": ["user1@...", "user2@..."]` | 관리자 그룹 알림                |
| 전체 | `"whole": true, "to": []`          | 시스템 공지 (보안 정책 변경 등) |

---

## 5. 버튼 타입

| 타입      | 설명                         | MFA 활용                   |
| --------- | ---------------------------- | -------------------------- |
| `link`    | 외부 웹 링크 (브라우저 오픈) | 보안 대시보드 이동         |
| `webview` | 앱 내 웹뷰로 열기            | 모바일에서 MFA 관리 페이지 |
| `image`   | 이미지 링크 보기             | 스크린샷, QR 코드 등       |

### 버튼 레이아웃

| 레이아웃     | 적용                | 글자 제한 |
| ------------ | ------------------- | --------- |
| `horizontal` | 버튼 2개 이하       | 8자       |
| `vertical`   | 버튼 3개 / carousel | 14자      |

---

## 6. 글자 수 제한

| 필드                     | 제한    | 초과 시   |
| ------------------------ | ------- | --------- |
| `header`                 | 50자    | 자동 잘림 |
| `contents` (text/card)   | 1,000자 | 자동 잘림 |
| `contents` (list item)   | 200자   | 자동 잘림 |
| `title` (card)           | 100자   | 자동 잘림 |
| `title` (list item)      | 50자    | 자동 잘림 |
| 버튼 텍스트 (vertical)   | 14자    | 자동 잘림 |
| 버튼 텍스트 (horizontal) | 8자     | 자동 잘림 |

---

## 7. 항목 수 제한

| 타입                   | 제한      |
| ---------------------- | --------- |
| `static` 리스트 항목   | 최대 5개  |
| `carousel` 리스트 항목 | 최대 4개  |
| 버튼                   | 최대 3개  |
| Webhook 봇 등록        | 최대 20개 |

---

## 8. HTTP 상태 코드

| 상태 | Code                | 설명               | 대응           |
| ---- | ------------------- | ------------------ | -------------- |
| 200  | -                   | 성공               | -              |
| 403  | `invalid_request`   | 잘못된 요청        | payload 확인   |
| 410  | `invalid_contract`  | 유효하지 않은 계약 | 관리자 문의    |
| 419  | `invalid_token`     | 만료된 토큰        | 토큰 재발급    |
| 422  | `invalid_parameter` | 잘못된 파라미터    | 필드 형식 확인 |

---

## 9. MFA 알림 전략 매핑 (Phase C 참조)

### 현재 (Phase B) — 기본 텍스트

| 이벤트           | type      | template | 설명               |
| ---------------- | --------- | -------- | ------------------ |
| 모든 로그인 알림 | `default` | `text`   | 간단한 텍스트 알림 |

### Phase C — 알림 3단계

| 단계                  | type     | template                   | 사용 이벤트                                |
| --------------------- | -------- | -------------------------- | ------------------------------------------ |
| **기본** (9시 요약)   | `static` | `list`                     | 전날 로그인 이력 요약 (최대 5건)           |
| **중요** (즉시)       | `static` | `text`                     | 새 디바이스, 해외 IP, 2FA 변경 — 버튼 포함 |
| **크리티컬** (선조치) | `static` | `text` + `important: true` | 자동 차단 후 "보안 설정 확인" 버튼         |

### Phase D — 고도화

| 기능                 | type       | template | 사용 사례                      |
| -------------------- | ---------- | -------- | ------------------------------ |
| 주간 보안 리포트     | `carousel` | `card`   | 로그인 통계 + 보안 상태 카드   |
| 크로스 디바이스 인증 | `static`   | `text`   | 1회성 코드 발송 + webview 버튼 |

---

## 10. 환경변수

```bash
# .env (officemfa-backend)
NOTIFICATION_ENABLED=true
MESSENGER_WEBHOOK_URL=https://jiran-api.officewave.co.kr/api/v1/hooks/{발급받은토큰}/notifications
```

> `MESSENGER_API_KEY`는 불필요 — URL 자체에 토큰 포함

---

## 11. 참고

- Webhook 관리: https://admin.officewave.co.kr/managements/environment/webhook/
- API 문서 원본: https://jiransoft.gitbook.io/adminmanual/serviceguide/messenger_api
- MFA 알림 설계: `docs/07-메신저알림연동가이드.md`
- MFA 알림 구현: `src/modules/notification/` (MessengerClientService, NotificationService)
