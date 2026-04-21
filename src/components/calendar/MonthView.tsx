'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Category } from '@/lib/types';

interface Props {
  month: Date;
  selected: Date | null;
  events: CalendarEvent[];
  categories: Category[];
  onSelect: (date: Date) => void;
  onDoubleSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function toISO(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function MonthView({
  month,
  selected,
  events,
  categories,
  onSelect,
  onDoubleSelect,
  onEventClick
}: Props) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  const categoryMap = new Map(categories.map((c) => [c.id, c] as const));

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAY_LABELS.map((wd, i) => (
          <div
            key={wd}
            className={cn(
              'px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide',
              i === 0 && 'text-rose-500',
              i === 6 && 'text-blue-500'
            )}
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6">
        {days.map((d) => {
          const iso = toISO(d);
          const dayEvents = events.filter((e) => e.date === iso);
          const inMonth = isSameMonth(d, month);
          const today = isToday(d);
          const isSelected = selected ? isSameDay(d, selected) : false;
          const weekday = d.getDay();

          return (
            <div
              key={iso}
              onClick={() => onSelect(d)}
              onDoubleClick={() => onDoubleSelect(d)}
              className={cn(
                'group relative min-h-[7.5rem] cursor-pointer border-b border-r p-2 transition-colors last:border-r-0 cell-hover',
                !inMonth && 'bg-muted/20 text-muted-foreground',
                isSelected && 'bg-accent/70 ring-2 ring-primary/60 ring-inset',
                today && 'bg-primary/5'
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium tabular-nums',
                    today && 'bg-primary text-primary-foreground shadow-soft',
                    !today && weekday === 0 && inMonth && 'text-rose-500',
                    !today && weekday === 6 && inMonth && 'text-blue-500'
                  )}
                >
                  {d.getDate()}
                </div>
                {dayEvents.length > 0 && !today && (
                  <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((ev) => {
                  const cat = ev.categoryId ? categoryMap.get(ev.categoryId) : null;
                  return (
                    <button
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                      className={cn(
                        'group/item flex w-full items-center gap-1.5 truncate rounded-md border px-1.5 py-0.5 text-left text-[11px] font-medium transition-colors hover:shadow-soft',
                        'bg-background/80'
                      )}
                      style={
                        cat
                          ? {
                              borderColor: `${cat.color}55`,
                              color: cat.color
                            }
                          : undefined
                      }
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: cat?.color ?? '#94a3b8' }}
                      />
                      <span className="truncate">{ev.title}</span>
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="px-1.5 text-[10px] font-medium text-muted-foreground">
                    + {dayEvents.length - 3}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>{format(month, 'yyyy MMM', { locale: ko })}</span>
        <span>더블클릭으로 빠른 등록</span>
      </div>
    </div>
  );
}
