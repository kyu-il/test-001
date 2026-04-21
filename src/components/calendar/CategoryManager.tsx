'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { Category, NewCategory } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCreate: (input: NewCategory) => Promise<void> | void;
  onUpdate: (id: string, patch: Partial<NewCategory>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

const PALETTE = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899'
];

export function CategoryManager({
  open,
  onOpenChange,
  categories,
  onCreate,
  onUpdate,
  onDelete
}: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[6]);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onCreate({ name: trimmed, color });
    setName('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>카테고리</DialogTitle>
          <DialogDescription>일정을 분류할 태그를 관리합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
            <Label>새 카테고리</Label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 마케팅"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                }}
              />
              <Button onClick={handleAdd} disabled={!name.trim()}>
                <Plus className="h-4 w-4" />
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-6 w-6 rounded-full border-2 transition',
                    color === c ? 'border-foreground/70 scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`색상 ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {categories.length === 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                아직 카테고리가 없습니다.
              </div>
            )}
            {categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onUpdate={(patch) => onUpdate(cat.id, patch)}
                onDelete={() => onDelete(cat.id)}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryRow({
  category,
  onUpdate,
  onDelete
}: {
  category: Category;
  onUpdate: (patch: Partial<NewCategory>) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(category.name);
  const [color, setColor] = useState(category.color);

  async function commit() {
    const trimmed = draft.trim();
    if (trimmed && (trimmed !== category.name || color !== category.color)) {
      await onUpdate({ name: trimmed, color });
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2 transition hover:bg-accent/40">
      <div className="relative">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="h-5 w-5 rounded-full border shadow-soft"
          style={{ backgroundColor: color }}
          aria-label="색상 변경"
        />
      </div>

      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setDraft(category.name);
              setEditing(false);
            }
          }}
          className="h-8"
        />
      ) : (
        <button className="flex-1 text-left text-sm font-medium" onClick={() => setEditing(true)}>
          {category.name}
        </button>
      )}

      {editing && (
        <div className="flex items-center gap-1">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                'h-4 w-4 rounded-full border-2',
                color === c ? 'border-foreground/70' : 'border-transparent'
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={async () => {
          if (
            !confirm(
              `"${category.name}" 카테고리를 삭제할까요? 연결된 일정은 카테고리 없음으로 바뀝니다.`
            )
          )
            return;
          await onDelete();
        }}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
