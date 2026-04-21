# OpenSpec — test-001 (Team Calendar)

> **모드**: production · 사내 팀 달력 메모 서비스
> **위치**: 파이프라인 중앙 허브 — gstack/harness/omc가 참조
> **작성 경로**: `/pai design` Phase 2 (2026-04-21, pivot)
> **참조**: `docs/ideation.md`

---

## 1. 목적 (Purpose)

팀이 공유하는 일정/메모를 shadcn/ui 기반 월·주 달력으로 가볍게 관리한다. 날짜 더블클릭으로 즉시 일정 등록, 카테고리(이름+색상)로 구분, 오늘 강조.

## 2. 사용자 (Users)

| 역할           | 권한                         | 주요 시나리오                            |
| -------------- | ---------------------------- | ---------------------------------------- |
| 멤버 (member)  | 일정·카테고리 전체 조회/쓰기 | 날짜 더블클릭 → 일정 추가, 카테고리 선택 |
| 관리자 (admin) | 위 + 사용자 관리             | 멤버 초대/제거 (v2)                      |

## 3. 핵심 기능 (Features)

- [ ] 월 뷰 달력 (메인) — 주 7일 × 행 5~6
- [ ] 주 뷰 달력 — 타임 축 없는 리스트형 7일
- [ ] 이전/다음 달 내비, "오늘로" 버튼
- [ ] 오늘 날짜 강조 (틴트 + 굵은 숫자)
- [ ] 날짜 클릭 → 사이드 시트에 해당 일정 목록 + "추가" 버튼
- [ ] 날짜 **더블클릭** → 일정 등록 다이얼로그 즉시
- [ ] 카테고리 CRUD (이름 + 색상)
- [ ] 일정 CRUD (title, date, categoryId, memo)

### v2

- Supabase Auth 로그인/로그아웃, 팀 경계 RLS
- Supabase Postgres로 영속화
- 멤버 관리 콘솔

## 4. 기술 스택 (Stack)

- **Language**: TypeScript (strict)
- **Framework**: Next.js 14 App Router
- **UI**: shadcn/ui + Tailwind CSS + Radix + lucide-react
- **Date**: date-fns
- **Storage (MVP)**: `window.localStorage` (추상 repository 경유)
- **Storage (v2)**: Supabase Postgres + RLS
- **Auth (v2)**: Supabase Auth 이메일+비밀번호
- **Package Manager**: npm
- **Deploy**: Vercel
- **Test**: Vitest

## 5. API 엔드포인트 (Endpoints)

> MVP 단계는 클라이언트 전용이라 실제 HTTP 엔드포인트는 `/api/health`만. 나머지는 repository 인터페이스로 정의되고 v2에서 Supabase API로 매핑.

| Method | Path        | 설명     | 요청 | 응답                            |
| ------ | ----------- | -------- | ---- | ------------------------------- |
| GET    | /api/health | 헬스체크 | -    | `{ ok: true, version: string }` |

### v2 예정 엔드포인트 (참고)

| Method | Path                | 설명                            |
| ------ | ------------------- | ------------------------------- |
| POST   | /api/auth/login     | Supabase 이메일+비밀번호 로그인 |
| POST   | /api/auth/logout    | 로그아웃                        |
| GET    | /api/events         | `?from&to` 기간 이벤트          |
| POST   | /api/events         | 일정 생성                       |
| PATCH  | /api/events/:id     | 일정 수정                       |
| DELETE | /api/events/:id     | 일정 삭제                       |
| GET    | /api/categories     | 카테고리 목록                   |
| POST   | /api/categories     | 카테고리 생성                   |
| PATCH  | /api/categories/:id | 카테고리 수정                   |
| DELETE | /api/categories/:id | 카테고리 삭제                   |

## 6. Repository 인터페이스 (MVP)

`src/lib/repository.ts` — localStorage 구현. v2에서 동일 인터페이스를 Supabase 구현으로 교체.

```ts
interface Repository {
  listEvents(opts?: { from?: Date; to?: Date }): Promise<Event[]>;
  createEvent(input: Omit<Event, 'id' | 'createdAt'>): Promise<Event>;
  updateEvent(id: string, patch: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;

  listCategories(): Promise<Category[]>;
  createCategory(input: Omit<Category, 'id' | 'createdAt'>): Promise<Category>;
  updateCategory(id: string, patch: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
```

## 7. 비기능 요구사항

- 월 뷰 렌더링 < 200ms (일정 100건 기준)
- 모바일/데스크톱 반응형 (단, MVP는 데스크톱 우선)
- 다크/라이트 테마 모두 지원
- 접근성: 키보드 내비(Tab/Enter), 포커스 링 유지
