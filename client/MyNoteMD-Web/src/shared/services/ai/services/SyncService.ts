import { noteService, collectionService } from "../../api";
import type { Note } from "../db/schema";
import { db } from "../db/dexie";
import { EmbeddingService } from "./embedding.service";
import type { IEmbeddingService } from "../types";

let embeddingServiceInstance: IEmbeddingService = new EmbeddingService();

/**
 * Saves the note to the database and updates its embedding.
 * Ensures data integrity by performing operations within a Dexie transaction.
 */
export async function saveNoteWithEmbedding(note: Note): Promise<void> {
    try {
        // 1. Save the note
        await db.notes.put(note);

        // 2. Calculate embedding (asynchronous via Worker)
        const vector = await embeddingServiceInstance.getVector(note.content);

        // 3. Save embedding within transaction
        await db.transaction('rw', db.embeddings, async () => {
            await db.embeddings.put({
                noteId: note.id,
                vector: vector,
                updatedAt: note.updatedAt || Date.now()
            });
        });
    } catch (error) {
        console.error("Not embedding ile kaydedilirken hata oluştu:", error);
        throw error;
    }
}

export class SyncService {
    /**
     * Converts dates to numeric timestamp (milliseconds) format.
     */
    private toTimestamp(date: string | number | Date | undefined): number {
        if (!date) return 0;
        return new Date(date).getTime();
    }

    /**
     * Fetches all notes in the collection and retrieves missing/outdated ones.
     */
    async syncCollection(collectionId: string): Promise<void> {
        // Using getNotes instead of getNotesLookup due to 500 error.
        // getNotesLookup can be used when the backend is fixed.
        const response: any = await collectionService.getNotes(collectionId, { cursor: null });
        const items = response.items || [];

        for (const item of items) {
            await this.syncNoteDetail(item.id);
        }
    }

    /**
     * Fetches the details of a single note and compares it with the local database.
     */
    async syncNoteDetail(noteId: string): Promise<void> {
        // Get the latest details from the server
        const detail: Note = await noteService.getById(noteId);
        const localNote = await db.notes.get(noteId);

        const remoteUpdatedAt = this.toTimestamp(detail.updatedAt);
        const localUpdatedAt = localNote?.updatedAt || 0;

        // If the note doesn't exist or the server version is newer, update it
        if (!localNote || remoteUpdatedAt > localUpdatedAt) {

            const normalizedNote: Note = {
                ...detail,
                createdAt: this.toTimestamp(detail.createdAt),
                updatedAt: remoteUpdatedAt,
                publishedAt: this.toTimestamp(detail.publishedAt)
            };

            // Update note and embedding
            await saveNoteWithEmbedding(normalizedNote);
        }
    }

    public stop(): void {
        if (embeddingServiceInstance.terminate) {
            embeddingServiceInstance.terminate();
            embeddingServiceInstance = new EmbeddingService();
        }
    }
}

export const syncService = new SyncService();
