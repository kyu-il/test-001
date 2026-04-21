import type { CalendarEvent, Category, NewCategory, NewEvent } from './types';

export interface Repository {
  listEvents(opts?: { from?: string; to?: string }): Promise<CalendarEvent[]>;
  createEvent(input: NewEvent): Promise<CalendarEvent>;
  updateEvent(id: string, patch: Partial<NewEvent>): Promise<CalendarEvent>;
  deleteEvent(id: string): Promise<void>;

  listCategories(): Promise<Category[]>;
  createCategory(input: NewCategory): Promise<Category>;
  updateCategory(id: string, patch: Partial<NewCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
