'use client';

import { LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { SessionUser } from '@/lib/session';

interface Props {
  user: SessionUser;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: Props) {
  const initials = user.name.slice(0, 2);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="사용자 메뉴"
        >
          {user.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profilePhotoUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-0">
        <div className="px-4 py-3">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email || user.account}</p>
        </div>
        <div className="border-t">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
