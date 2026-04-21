'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Category, NewEvent } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  event?: CalendarEvent | null;
  categories: Category[];
  onSave: (input: NewEvent, id?: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}

export function EventDialog({
  open,
  onOpenChange,
  date,
  event,
  categories,
  onSave,
  onDelete
}: Props) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setMemo(event.memo ?? '');
      setCategoryId(event.categoryId);
      setDateStr(event.date);
    } else {
      setTitle('');
      setMemo('');
      setCategoryId(categories[0]?.id ?? null);
      setDateStr(date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    }
  }, [open, event, date, categories]);

  const headingDate = (() => {
    try {
      return format(new Date(`${dateStr}T00:00:00`), 'yyyy년 M월 d일 (EEE)', { locale: ko });
    } catch {
      return dateStr;
    }
  })();

  const canSave = title.trim().length > 0 && dateStr.length > 0;

  async function handleSubmit() {
    if (!canSave) return;
    await onSave(
      {
        title: title.trim(),
        date: dateStr,
        categoryId,
        memo: memo.trim() || undefined
      },
      event?.id
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? '일정 수정' : '새 일정'}</DialogTitle>
          <DialogDescription>{headingDate}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="예: 기획 리뷰"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>카테고리</Label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
                  categoryId === null
                    ? 'border-foreground/40 bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                없음
              </button>
              {categories.map((c) => {
                const active = c.id === categoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition'
                    )}
                    style={{
                      borderColor: active ? c.color : `${c.color}55`,
                      backgroundColor: active ? `${c.color}22` : 'transparent',
                      color: active ? c.color : undefined
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memo">메모 (선택)</Label>
            <Textarea
              id="memo"
              placeholder="추가 메모"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {event && onDelete && (
            <Button
              variant="ghost"
              className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={async () => {
                if (!event) return;
                if (!confirm('이 일정을 삭제할까요?')) return;
                await onDelete(event.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!canSave}>
            {event ? '저장' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
