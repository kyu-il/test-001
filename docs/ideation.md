# Ideation — test-001 (Team Calendar)

> 작성일: 2026-04-21 (pivot)
> 이전 버전: 사내 KPI 대시보드 — 달력 메모 서비스로 전면 전환

---

## 1. 해결하고자 하는 문제

팀이 공유하는 일정·메모를 빠르게 기록하고 한눈에 보기 위한 **경량 팀 달력**. 엔터프라이즈 캘린더의 무거움 없이, 날짜 더블클릭으로 즉시 일정 등록이 가능한 구글시트·엑셀 대체재.

## 2. 대상 사용자

- 팀원 (멤버) — 일정 조회·등록·수정, 카테고리 선택
- 관리자 — 위 + 카테고리 제작·수정·삭제, 멤버 관리(후순위)

## 3. 기존 대안 대비 차별점

- 복잡한 Google Calendar 대비 **최소 필드**(타이틀·날짜·카테고리·메모)로 진입장벽 낮춤
- 팀 단일 달력 (개인/그룹 권한 복잡도 제거)
- **Apple Calendar/Fantastical 톤**의 부드러운 production UI — shadcn/ui 기반

## 4. MVP 핵심 기능

1. 월/주 뷰 달력 (메인은 월)
2. 이전/다음 달 내비, **오늘 날짜 강조**
3. 날짜 클릭 → 해당 날 일정 목록 + "일정 추가" 버튼
4. **날짜 더블클릭** → 일정 등록 다이얼로그 즉시 오픈
5. 카테고리 등록 (이름 + 색상)
6. 일정 등록/수정/삭제 (카테고리 선택 포함)
7. 인증(이메일+비밀번호, Supabase Auth) — **v2 작업**

### Non-Goals (MVP 제외)

- 반복 일정(RRULE), 참석자, 알림, OfficeChat 연동
- 일(day) 뷰, 연(year) 뷰
- 카테고리 계층·아이콘
- 외부 캘린더 동기화

## 5. 일정 제약

- **1차 데모 (localhost)**: 이번 세션 — localStorage 기반 UI 동작
- **Supabase 연동**: 다음 세션 — Auth + Postgres 스키마 + API
- **팀 내부 MVP**: 2026-05-05 목표 유지

## 6. 기술 스택

- TypeScript + Next.js (App Router)
- shadcn/ui + Tailwind CSS + Radix
- 아이콘: lucide-react
- 날짜: date-fns
- 저장: 1차는 localStorage, 2차 Supabase (Postgres + Auth)
- 배포: Vercel

## 7. 디자인 원칙

- Apple Calendar/Fantastical 영감: 넉넉한 여백, 둥근 모서리, 얕은 그림자
- 오늘 날짜: 배경 틴트 + 진한 숫자
- 카테고리는 dot + 테두리로 표시 (박스 꽉 채우지 않음)
- 다크/라이트 모드 양쪽 지원 (shadcn theme)
- 인터랙션은 부드럽게 (Framer Motion 없이 Tailwind transition만)
