import Dexie, { type Table } from 'dexie';
import { type Note, type NoteEmbedding, type NoteLookup } from './schema';

class MyDatabase extends Dexie {
    notes!: Table<Note>;
    embeddings!: Table<NoteEmbedding>;
    noteLookups!: Table<NoteLookup>;

    constructor() {
        super('NoteAI_DB');
        this.version(1).stores({
            notes: 'id, collectionId, updatedAt',
            embeddings: 'noteId, updatedAt',
            noteLookups: 'id'
        });
    }
}

export const db = new MyDatabase();