import { supabase } from './supabase';
import type { Repository } from './repository';
import type { CalendarEvent, Category, NewCategory, NewEvent } from './types';

function toEvent(row: Record<string, unknown>): CalendarEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    categoryId: (row.category_id as string | null) ?? null,
    memo: (row.memo as string | undefined) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    createdAt: row.created_at as string
  };
}

export const supabaseRepository: Repository = {
  async listEvents(opts) {
    let q = supabase.from('events').select('*').order('created_at');
    if (opts?.from) q = q.gte('date', opts.from);
    if (opts?.to) q = q.lte('date', opts.to);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(toEvent);
  },

  async createEvent(input: NewEvent) {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: input.title,
        date: input.date,
        category_id: input.categoryId ?? null,
        memo: input.memo ?? null
      })
      .select()
      .single();
    if (error) throw error;
    return toEvent(data);
  },

  async updateEvent(id, patch) {
    const update: Record<string, unknown> = {};
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.date !== undefined) update.date = patch.date;
    if ('categoryId' in patch) update.category_id = patch.categoryId ?? null;
    if ('memo' in patch) update.memo = patch.memo ?? null;

    const { data, error } = await supabase
      .from('events')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toEvent(data);
  },

  async deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async listCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('created_at');
    if (error) throw error;
    return (data ?? []).map(toCategory);
  },

  async createCategory(input: NewCategory) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: input.name, color: input.color })
      .select()
      .single();
    if (error) throw error;
    return toCategory(data);
  },

  async updateCategory(id, patch) {
    const update: Record<string, unknown> = {};
    if (patch.name !== undefined) update.name = patch.name;
    if (patch.color !== undefined) update.color = patch.color;

    const { data, error } = await supabase
      .from('categories')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toCategory(data);
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }
};
