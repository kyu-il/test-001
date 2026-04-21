export interface Category {
  id: string;
  name: string;
  color: string; // hex, e.g. "#ef4444"
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  categoryId: string | null;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewEvent = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type NewCategory = Omit<Category, 'id' | 'createdAt'>;
