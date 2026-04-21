create table if not exists users (
  id                uuid primary key default gen_random_uuid(),
  oauth_id          integer not null unique,
  group_id          integer,
  account           text not null,
  name              text not null,
  email             text,
  profile_photo_url text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger users_updated_at
  before update on users
  for each row execute procedure set_updated_at();

alter table users disable row level security;
