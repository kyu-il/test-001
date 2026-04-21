'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Category } from '@/lib/types';

interface Props {
  date: Date | null;
  events: CalendarEvent[];
  categories: Category[];
  onClose: () => void;
  onAdd: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function DaySheet({ date, events, categories, onClose, onAdd, onEventClick }: Props) {
  if (!date) {
    return (
      <aside className="hidden min-h-[20rem] items-center justify-center rounded-2xl border bg-card p-6 text-center shadow-soft lg:flex">
        <div className="space-y-2 text-muted-foreground">
          <p className="text-sm">날짜를 선택하면 일정이 여기 표시됩니다</p>
          <p className="text-xs">더블클릭으로 빠른 등록도 가능합니다</p>
        </div>
      </aside>
    );
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c] as const));
  const title = format(date, 'M월 d일 EEEE', { locale: ko });
  const sub = format(date, 'yyyy년', { locale: ko });
  const weekday = date.getDay();

  return (
    <aside className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {sub}
          </div>
          <h2
            className={cn(
              'text-xl font-semibold',
              weekday === 0 && 'text-rose-500',
              weekday === 6 && 'text-blue-500'
            )}
          >
            {title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full lg:hidden"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={onAdd} className="w-full gap-2">
        <CalendarPlus className="h-4 w-4" />이 날 일정 추가
      </Button>

      <div className="mt-1 space-y-1.5">
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            등록된 일정이 없습니다.
          </div>
        ) : (
          events.map((ev) => {
            const cat = ev.categoryId ? categoryMap.get(ev.categoryId) : null;
            return (
              <button
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className="flex w-full items-start gap-3 rounded-xl border bg-background/60 p-3 text-left transition hover:shadow-soft"
                style={cat ? { borderColor: `${cat.color}44` } : undefined}
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: cat?.color ?? '#94a3b8' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="truncate text-sm font-medium">{ev.title}</div>
                    {cat && (
                      <span className="text-[11px] font-medium" style={{ color: cat.color }}>
                        {cat.name}
                      </span>
                    )}
                  </div>
                  {ev.memo && (
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ev.memo}</div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
