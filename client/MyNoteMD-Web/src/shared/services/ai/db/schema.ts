export interface NoteLookup {
    id: string;
    title: string;
}

// Notun kendisi ve yerel embedding durumu
export interface Note {
    id: string; // Guid string
    title: string;
    slug: string;
    content: string; // Draft Content
    publishedContent?: string;
    isPublic: boolean;
    hasUnpublishedChanges: boolean;
    collectionId: string;
    createdAt: number; // Timestamp
    updatedAt?: number;
    publishedAt?: number;
    // AI için gerekli embedding durumu
    lastSyncedAt?: number; // Sunucudan en son ne zaman çekildi
}

export interface NoteEmbedding {
    noteId: string; // Primary Key
    vector: Float32Array; // Vektör verisi
    updatedAt: number; // Bu vektörün oluşturulduğu notun updatedAt değeri
}