'use client';

import { ChevronLeft, ChevronRight, Plus, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'month' | 'week';

interface Props {
  date: Date;
  viewMode: ViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (m: ViewMode) => void;
  onNewEvent: () => void;
  onManageCategories: () => void;
}

export function CalendarHeader({
  date,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewModeChange,
  onNewEvent,
  onManageCategories
}: Props) {
  const title =
    viewMode === 'month'
      ? format(date, 'yyyy년 M월', { locale: ko })
      : `${format(date, 'yyyy년 M월 d일', { locale: ko })} 주`;

  return (
    <header className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            aria-label="이전"
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            aria-label="다음"
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="ml-2 hidden sm:inline-flex"
        >
          오늘
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-full border bg-muted/40 p-1">
          {(['month', 'week'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onViewModeChange(m)}
              className={cn(
                'relative h-8 rounded-full px-4 text-sm font-medium transition-colors',
                viewMode === m
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {m === 'month' ? '월' : '주'}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onManageCategories} className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">카테고리</span>
        </Button>
        <Button size="sm" onClick={onNewEvent} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">일정 추가</span>
        </Button>
      </div>
    </header>
  );
}
