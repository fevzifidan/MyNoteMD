import { db } from "../db/dexie";
import { EmbeddingService } from "./embedding.service";
import cosineSimilarity from "../utils/cosineSimilarity";

const embeddingService = new EmbeddingService();

export async function searchRelevantNotes(question: string, collectionId: string, limit = 3) {
    // 1. Soruyu vektöre çevir
    const questionVector = await embeddingService.getVector(question);

    // 2. İlgili koleksiyondaki tüm notların embeddinglerini çek
    const notesInCollection = await db.notes.where('collectionId').equals(collectionId).toArray();

    // 3. Her bir not için benzerlik skoru hesapla
    const scoredNotes = [];

    for (const note of notesInCollection) {
        const embedding = await db.embeddings.get(note.id);

        if (embedding) {
            const score = cosineSimilarity(questionVector, embedding.vector);
            scoredNotes.push({ note, score });
        }
    }

    // 4. Skorları yüksekten düşüğe sırala ve limitli olanları döndür
    return scoredNotes
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.note);
}