'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { addMonths, addWeeks, format } from 'date-fns';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DaySheet } from '@/components/calendar/DaySheet';
import { EventDialog } from '@/components/calendar/EventDialog';
import { CategoryManager } from '@/components/calendar/CategoryManager';
import { supabaseRepository as repo } from '@/lib/repository.supabase';
import type { CalendarEvent, Category, NewCategory, NewEvent } from '@/lib/types';

type ViewMode = 'month' | 'week';

function toISO(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

export default function CalendarPage() {
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selected, setSelected] = useState<Date | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<Date | null>(null);
  const [dialogEvent, setDialogEvent] = useState<CalendarEvent | null>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  const reload = useCallback(async () => {
    const [evs, cats] = await Promise.all([repo.listEvents(), repo.listCategories()]);
    setEvents(evs);
    setCategories(cats);
  }, []);

  useEffect(() => {
    (async () => {
      await reload();
      setLoaded(true);
    })();
  }, [reload]);

  const selectedEvents = useMemo(() => {
    if (!selected) return [];
    const iso = toISO(selected);
    return events
      .filter((e) => e.date === iso)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [events, selected]);

  const handlePrev = () => {
    setAnchor(viewMode === 'month' ? addMonths(anchor, -1) : addWeeks(anchor, -1));
  };
  const handleNext = () => {
    setAnchor(viewMode === 'month' ? addMonths(anchor, 1) : addWeeks(anchor, 1));
  };
  const handleToday = () => {
    const today = new Date();
    setAnchor(today);
    setSelected(today);
  };

  const openNewEvent = (date?: Date) => {
    setDialogEvent(null);
    setDialogDate(date ?? selected ?? new Date());
    setDialogOpen(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setDialogEvent(event);
    setDialogDate(new Date(`${event.date}T00:00:00`));
    setDialogOpen(true);
  };

  const handleSaveEvent = async (input: NewEvent, id?: string) => {
    if (id) {
      await repo.updateEvent(id, input);
    } else {
      await repo.createEvent(input);
    }
    await reload();
  };

  const handleDeleteEvent = async (id: string) => {
    await repo.deleteEvent(id);
    await reload();
  };

  const handleCreateCategory = async (input: NewCategory) => {
    await repo.createCategory(input);
    await reload();
  };
  const handleUpdateCategory = async (id: string, patch: Partial<NewCategory>) => {
    await repo.updateCategory(id, patch);
    await reload();
  };
  const handleDeleteCategory = async (id: string) => {
    await repo.deleteCategory(id);
    await reload();
  };

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-10">
      <CalendarHeader
        date={anchor}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewModeChange={setViewMode}
        onNewEvent={() => openNewEvent()}
        onManageCategories={() => setCategoryManagerOpen(true)}
      />

      {loaded ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            {viewMode === 'month' ? (
              <MonthView
                month={anchor}
                selected={selected}
                events={events}
                categories={categories}
                onSelect={setSelected}
                onDoubleSelect={(d) => openNewEvent(d)}
                onEventClick={openEditEvent}
              />
            ) : (
              <WeekView
                anchor={anchor}
                selected={selected}
                events={events}
                categories={categories}
                onSelect={setSelected}
                onDoubleSelect={(d) => openNewEvent(d)}
                onEventClick={openEditEvent}
              />
            )}
          </div>

          <DaySheet
            date={selected}
            events={selectedEvents}
            categories={categories}
            onClose={() => setSelected(null)}
            onAdd={() => openNewEvent(selected ?? new Date())}
            onEventClick={openEditEvent}
          />
        </div>
      ) : (
        <div className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
          불러오는 중…
        </div>
      )}

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={dialogDate}
        event={dialogEvent}
        categories={categories}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      <CategoryManager
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
        categories={categories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
    </main>
  );
}
