create extension if not exists "uuid-ossp";

create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  color      text not null default '#3b82f6',
  created_at timestamptz not null default now()
);

create table if not exists events (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  date        date not null,
  category_id uuid references categories(id) on delete set null,
  memo        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at 자동 갱신 트리거
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_updated_at
  before update on events
  for each row execute procedure set_updated_at();

-- MVP: RLS 비활성화 (v2에서 팀 격리 RLS 추가)
alter table categories disable row level security;
alter table events disable row level security;
