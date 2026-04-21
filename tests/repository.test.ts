import { beforeEach, describe, expect, it } from 'vitest';

// jsdom-less, emulate localStorage for node environment
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

// @ts-expect-error -- inject for node
globalThis.window = { localStorage: new MemoryStorage() };

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { localRepository } = await import('../src/lib/repository.local');

beforeEach(() => {
  // @ts-expect-error -- reset
  globalThis.window.localStorage = new MemoryStorage();
});

describe('localRepository', () => {
  it('seeds default categories', async () => {
    const cats = await localRepository.listCategories();
    expect(cats.length).toBeGreaterThan(0);
  });

  it('creates and lists events', async () => {
    const [cat] = await localRepository.listCategories();
    const ev = await localRepository.createEvent({
      title: '테스트',
      date: '2026-04-21',
      categoryId: cat.id
    });
    expect(ev.id).toBeTruthy();
    const list = await localRepository.listEvents();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('테스트');
  });

  it('nulls categoryId on category delete', async () => {
    const cat = await localRepository.createCategory({ name: 'TMP', color: '#ff0000' });
    await localRepository.createEvent({
      title: 'bound',
      date: '2026-04-21',
      categoryId: cat.id
    });
    await localRepository.deleteCategory(cat.id);
    const list = await localRepository.listEvents();
    expect(list[0].categoryId).toBeNull();
  });
});
