'use client';

import { eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Category } from '@/lib/types';

interface Props {
  anchor: Date;
  selected: Date | null;
  events: CalendarEvent[];
  categories: Category[];
  onSelect: (date: Date) => void;
  onDoubleSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function toISO(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

export function WeekView({
  anchor,
  selected,
  events,
  categories,
  onSelect,
  onDoubleSelect,
  onEventClick
}: Props) {
  const start = startOfWeek(anchor, { weekStartsOn: 0 });
  const end = endOfWeek(anchor, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  const categoryMap = new Map(categories.map((c) => [c.id, c] as const));

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
      {days.map((d) => {
        const iso = toISO(d);
        const dayEvents = events.filter((e) => e.date === iso);
        const today = isToday(d);
        const isSelected = selected ? isSameDay(d, selected) : false;
        const weekday = d.getDay();

        return (
          <div
            key={iso}
            onClick={() => onSelect(d)}
            onDoubleClick={() => onDoubleSelect(d)}
            className={cn(
              'group relative min-h-[11rem] cursor-pointer rounded-2xl border bg-card p-3 shadow-soft transition-all hover:shadow-lift',
              today && 'ring-2 ring-primary/40',
              isSelected && 'ring-2 ring-primary/70'
            )}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <div
                className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  weekday === 0 && 'text-rose-500',
                  weekday === 6 && 'text-blue-500',
                  !(weekday === 0 || weekday === 6) && 'text-muted-foreground'
                )}
              >
                {format(d, 'EEE', { locale: ko })}
              </div>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums',
                  today && 'bg-primary text-primary-foreground shadow-soft'
                )}
              >
                {d.getDate()}
              </div>
            </div>

            <div className="space-y-1.5">
              {dayEvents.length === 0 && (
                <div className="pt-4 text-center text-[11px] text-muted-foreground">
                  더블클릭으로 등록
                </div>
              )}
              {dayEvents.map((ev) => {
                const cat = ev.categoryId ? categoryMap.get(ev.categoryId) : null;
                return (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                    className="flex w-full items-start gap-2 rounded-lg border bg-background/60 px-2 py-1.5 text-left text-xs transition hover:shadow-soft"
                    style={cat ? { borderColor: `${cat.color}55` } : undefined}
                  >
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: cat?.color ?? '#94a3b8' }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{ev.title}</div>
                      {ev.memo && (
                        <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                          {ev.memo}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
