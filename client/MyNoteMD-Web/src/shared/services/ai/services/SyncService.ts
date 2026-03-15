import { noteService, collectionService } from "../../api";
import type { Note } from "../db/schema";
import { db } from "../db/dexie";
import { EmbeddingService } from "./embedding.service";
import type { IEmbeddingService } from "../types";

let embeddingServiceInstance: IEmbeddingService = new EmbeddingService();

/**
 * Notu hem veritabanına kaydeder hem de embedding'ini günceller.
 * İşlemleri Dexie transaction içine alarak veri bütünlüğünü sağlar.
 */
export async function saveNoteWithEmbedding(note: Note): Promise<void> {
    try {
        // 1. Notu kaydet
        await db.notes.put(note);

        // 2. Embedding'i hesapla (Worker üzerinden - asenkron)
        const vector = await embeddingServiceInstance.getVector(note.content);

        // 3. Embedding'i transaction içinde kaydet
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
     * Tarihleri her zaman sayısal timestamp (milisaniye) formatına çevirir.
     */
    private toTimestamp(date: string | number | Date | undefined): number {
        if (!date) return 0;
        return new Date(date).getTime();
    }

    /**
     * Koleksiyondaki tüm notları lookup eder ve eksik/güncel olmayanları çeker.
     */
    async syncCollection(collectionId: string): Promise<void> {
        // 500 hatası aldığı için getNotesLookup yerine getNotes kullanıyoruz.
        // Gelecekte backend düzelirse getNotesLookup'a dönülebilir.
        const response: any = await collectionService.getNotes(collectionId, { cursor: null });
        const items = response.items || [];

        for (const item of items) {
            await this.syncNoteDetail(item.id);
        }
    }

    /**
     * Tek bir notun detayını çeker ve yerel veritabanıyla kıyaslar.
     */
    async syncNoteDetail(noteId: string): Promise<void> {
        // Sunucudan güncel detayı çek
        const detail: Note = await noteService.getById(noteId);
        const localNote = await db.notes.get(noteId);

        const remoteUpdatedAt = this.toTimestamp(detail.updatedAt);
        const localUpdatedAt = localNote?.updatedAt || 0;

        // Eğer not hiç yoksa veya sunucudaki daha güncelse güncelle
        if (!localNote || remoteUpdatedAt > localUpdatedAt) {

            const normalizedNote: Note = {
                ...detail,
                createdAt: this.toTimestamp(detail.createdAt),
                updatedAt: remoteUpdatedAt,
                publishedAt: this.toTimestamp(detail.publishedAt)
            };

            // Notu ve embedding'i güncelle
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