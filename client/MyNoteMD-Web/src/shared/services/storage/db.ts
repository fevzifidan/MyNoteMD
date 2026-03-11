import Dexie, { type Table } from 'dexie';
import { type IContextMetadata, type IPaginatedItem } from './types';

export class AppDatabase extends Dexie {
  // 1. Tablo tiplerini tanımlıyoruz
  items!: Table<IPaginatedItem>;      // Pagination referans tablosu
  contexts!: Table<IContextMetadata>; // Pagination metadata tablosu
  notes!: Dexie.Table<any, string>;        // Notların tipi
  collections!: Dexie.Table<any, string>;  // Koleksiyonların tipi

  constructor() {
    super('MyAppPaginationDB');

    // 2. Şemayı tanımlıyoruz
    // Sol taraftaki isimler (items, contexts) kodda db.items veya db.contexts 
    // şeklinde erişilen tablo isimleridir.
    this.version(1).stores({
      items: "id, contextId, index, dataId, itemType",
      contexts: "contextId",
      notes: "id",
      collections: "id"
    });
  }
}

// Singleton instance
export const db = new AppDatabase();