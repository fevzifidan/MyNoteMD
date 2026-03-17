import { db } from "../db/dexie";
import { EmbeddingService } from "./embedding.service";
import cosineSimilarity from "../utils/cosineSimilarity";

const embeddingService = new EmbeddingService();

export async function searchRelevantNotes(question: string, collectionId: string, limit = 3) {
    // 1. Convert question to vector
    const questionVector = await embeddingService.getVector(question);

    // 2. Get all note embeddings in the relevant collection
    const notesInCollection = await db.notes.where('collectionId').equals(collectionId).toArray();

    // 3. Calculate similarity score for each note
    const scoredNotes = [];

    for (const note of notesInCollection) {
        const embedding = await db.embeddings.get(note.id);

        if (embedding) {
            const score = cosineSimilarity(questionVector, embedding.vector);
            scoredNotes.push({ note, score });
        }
    }

    // 4. Sort scores from high to low and return the limited ones
    return scoredNotes
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.note);
}