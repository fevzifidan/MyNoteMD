// pagination-storage-service.ts
import { db } from './db';
import { type IPaginatedItem, type IContextMetadata } from './types';

// Hangi itemType'ın hangi tabloya karşılık geldiğini belirleyen yardımcı tip
type TableName = 'notes' | 'collections';

export class PaginationStorageService {
  
  async upsertPage<T extends { id: string }>(
    contextId: string, 
    items: T[], 
    nextCursor: string | null,
    itemType: 'note' | 'collection'
  ) {
    const targetTable: TableName = itemType === 'note' ? 'notes' : 'collections';

    return await db.transaction('rw', [db.items, db.contexts, db[targetTable]], async () => {
      let context = await db.contexts.get(contextId);
      if (!context) {
        context = { contextId, nextCursor: null, totalItems: 0, lastSync: Date.now() };
      }

      const startIndex = context.totalItems;

      await (db[targetTable] as any).bulkPut(items);

      const paginationRefs: IPaginatedItem[] = items.map((item, i) => ({
        id: crypto.randomUUID(),
        contextId,
        index: startIndex + i,
        dataId: item.id,
        itemType,
        createdAt: Date.now()
      }));

      await db.items.bulkPut(paginationRefs);

      await db.contexts.put({
        ...context,
        nextCursor,
        totalItems: startIndex + items.length,
        lastSync: Date.now()
      });
    });
  }

  async getItemsByIndexRange<T>(
    contextId: string, 
    start: number, 
    limit: number
  ): Promise<(IPaginatedItem & { data: T | undefined })[]> {
    const refs = await db.items
      .where('[contextId+index]')
      .between([contextId, start], [contextId, start + limit - 1], true, true)
      .toArray();

    if (refs.length === 0) return [];

    const itemType = refs[0].itemType;
    const targetTable: TableName = itemType === 'note' ? 'notes' : 'collections';

    const dataIds = refs.map(r => r.dataId);
    const actualData = await (db[targetTable] as any).bulkGet(dataIds);

    return refs.map((ref, i) => ({
      ...ref,
      data: actualData[i] as T
    }));
  }

  async updateDomainData(itemType: 'note' | 'collection', id: string, updates: any) {
    const targetTable: TableName = itemType === 'note' ? 'notes' : 'collections';
    await (db[targetTable] as any).update(id, { ...updates });
  }

  async getNextCursor(contextId: string): Promise<string | null> {
    const context = await db.contexts.get(contextId);
    return context?.nextCursor || null;
  }

  async removeReference(paginationId: string) {
    await db.items.delete(paginationId);
  }

  async fullyDeleteItem(itemType: 'note' | 'collection', dataId: string) {
    const targetTable: TableName = itemType === 'note' ? 'notes' : 'collections';
    return await db.transaction('rw', [db.items, db[targetTable]], async () => {
      await db.items.where('dataId').equals(dataId).delete();
      await (db[targetTable] as any).delete(dataId);
    });
  }

  async clearContext(contextId: string) {
    await db.transaction('rw', [db.items, db.contexts], async () => {
      await db.items.where('contextId').equals(contextId).delete();
      await db.contexts.delete(contextId);
    });
  }
}

export const paginationStorage = new PaginationStorageService();