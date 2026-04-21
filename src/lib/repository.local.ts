'use client';

import { uid } from './utils';
import type { Repository } from './repository';
import type { CalendarEvent, Category, NewCategory, NewEvent } from './types';

const EVENTS_KEY = 'test001.events.v1';
const CATEGORIES_KEY = 'test001.categories.v1';

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedCategoriesIfEmpty(): Category[] {
  const existing = read<Category>(CATEGORIES_KEY);
  if (existing.length) return existing;
  const seed: Category[] = [
    { id: uid('c_'), name: '업무', color: '#3b82f6', createdAt: new Date().toISOString() },
    { id: uid('c_'), name: '개인', color: '#10b981', createdAt: new Date().toISOString() },
    { id: uid('c_'), name: '중요', color: '#ef4444', createdAt: new Date().toISOString() }
  ];
  write(CATEGORIES_KEY, seed);
  return seed;
}

export const localRepository: Repository = {
  async listEvents(opts) {
    const all = read<CalendarEvent>(EVENTS_KEY);
    if (!opts?.from && !opts?.to) return all;
    return all.filter((e) => {
      if (opts.from && e.date < opts.from) return false;
      if (opts.to && e.date > opts.to) return false;
      return true;
    });
  },

  async createEvent(input: NewEvent) {
    const now = new Date().toISOString();
    const entry: CalendarEvent = {
      id: uid('e_'),
      createdAt: now,
      updatedAt: now,
      ...input
    };
    const all = read<CalendarEvent>(EVENTS_KEY);
    write(EVENTS_KEY, [...all, entry]);
    return entry;
  },

  async updateEvent(id, patch) {
    const all = read<CalendarEvent>(EVENTS_KEY);
    let updated: CalendarEvent | null = null;
    const next = all.map((e) => {
      if (e.id !== id) return e;
      updated = { ...e, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) throw new Error(`event ${id} not found`);
    write(EVENTS_KEY, next);
    return updated;
  },

  async deleteEvent(id) {
    const all = read<CalendarEvent>(EVENTS_KEY);
    write(
      EVENTS_KEY,
      all.filter((e) => e.id !== id)
    );
  },

  async listCategories() {
    return seedCategoriesIfEmpty();
  },

  async createCategory(input: NewCategory) {
    seedCategoriesIfEmpty();
    const entry: Category = {
      id: uid('c_'),
      createdAt: new Date().toISOString(),
      ...input
    };
    const all = read<Category>(CATEGORIES_KEY);
    write(CATEGORIES_KEY, [...all, entry]);
    return entry;
  },

  async updateCategory(id, patch) {
    const all = read<Category>(CATEGORIES_KEY);
    let updated: Category | null = null;
    const next = all.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, ...patch };
      return updated;
    });
    if (!updated) throw new Error(`category ${id} not found`);
    write(CATEGORIES_KEY, next);
    return updated;
  },

  async deleteCategory(id) {
    const cats = read<Category>(CATEGORIES_KEY);
    write(
      CATEGORIES_KEY,
      cats.filter((c) => c.id !== id)
    );
    // clear category from events (null out)
    const all = read<CalendarEvent>(EVENTS_KEY);
    write(
      EVENTS_KEY,
      all.map((e) => (e.categoryId === id ? { ...e, categoryId: null } : e))
    );
  }
};
