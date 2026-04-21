# OMC — Object Model Context (test-001, Team Calendar)

> **모드**: production
> **업데이트**: 2026-04-21 (pivot to calendar)

---

## 도메인 객체

### Event

팀 달력의 일정 1건. 최소 필드 유지.

```ts
interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD (all-day, 시간 축 없음)
  categoryId: string | null;
  memo?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
```

### Category

일정 분류 태그. 이름 + 색상만.

```ts
interface Category {
  id: string;
  name: string;
  color: string; // hex, 예: "#ef4444"
  createdAt: string;
}
```

### User (v2)

MVP는 인증 없음. v2에서 Supabase Auth 연동 시 추가.

```ts
interface User {
  id: string; // Supabase auth.users.id
  email: string;
  role: 'admin' | 'member';
}
```

---

## 비즈니스 규칙

### MVP

- **무인증**: MVP는 클라이언트 전용, 인증/권한 체크 없음. localStorage에 모든 데이터.
- **카테고리 독립성**: 카테고리 삭제 시 연결된 Event의 `categoryId`는 `null`로 설정 (고아 방지).
- **날짜 무결성**: `Event.date`는 YYYY-MM-DD 포맷 고정. 타임존은 브라우저 로컬.
- **최소 유효성**: `title` 공백 금지, `date` 파싱 가능 필수.

### v2

- **Supabase RLS**: 모든 사용자가 같은 `team_id` 내 Event/Category를 조회·수정 (현재 MVP는 단일 팀 가정).
- **인증 필수**: Auth 연동 후 모든 쓰기는 로그인 사용자만.
- **관리자 전용**: 사용자 관리는 `role === 'admin'`.

---

## 도메인 ↔ Repository 매핑

| Repository 메서드           | 도메인 대상 | 비고                           |
| --------------------------- | ----------- | ------------------------------ |
| `listEvents({from, to})`    | Event[]     | from/to 범위 필터              |
| `createEvent(input)`        | Event       | id/createdAt 자동 생성         |
| `updateEvent(id, patch)`    | Event       | updatedAt 자동 갱신            |
| `deleteEvent(id)`           | void        | 하드 삭제                      |
| `listCategories()`          | Category[]  | 전체                           |
| `createCategory(input)`     | Category    | 색상 hex 검증                  |
| `updateCategory(id, patch)` | Category    |                                |
| `deleteCategory(id)`        | void        | 연결 Event.categoryId를 null로 |
