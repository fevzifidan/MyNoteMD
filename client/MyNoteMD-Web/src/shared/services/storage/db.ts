import Dexie, { type Table } from 'dexie';
import { type IContextMetadata, type IPaginatedItem } from './types';

export class AppDatabase extends Dexie {
  // 1. Define table types
  items!: Table<IPaginatedItem>;      // Pagination reference table
  contexts!: Table<IContextMetadata>; // Pagination metadata table
  notes!: Dexie.Table<any, string>;        // Note type
  collections!: Dexie.Table<any, string>;  // Collection type
  userConfirmationPreferences!: Dexie.Table<any, string>;  // User confirmation preferences

  constructor() {
    super('MyAppPaginationDB');

    // 2. Define the schema
    // The names on the left side (items, contexts) are the table names accessed in the code as db.items or db.contexts.
    this.version(1).stores({
      items: "id, contextId, index, dataId, itemType",
      contexts: "contextId",
      notes: "id",
      collections: "id",
      userConfirmationPreferences: "id"
    });
  }
}

// Singleton instance
export const db = new AppDatabase();