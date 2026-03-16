export type Vector = Float32Array;

// Embedding Worker Types
export type EmbeddingRequest = {
    type: 'CALCULATE_EMBEDDING';
    content: string;
};

export type EmbeddingResponse =
    | { type: 'EMBEDDING_RESULT'; vector: Vector }
    | EmbeddingError;

export type EmbeddingError = {
    type: 'EMBEDDING_ERROR';
    error: string;
};

// WebLLM Worker Types
export type ChatRequest = {
    type: 'GENERATE_CHAT';
    question: string;
    context: string[]; // Note chunks sent for RAG
    history?: ChatMessage[];
};


export type ChatResponse =
    | { type: 'CHUNK'; content: string }
    | { type: 'PROGRESS'; progress: number; text: string }
    | { type: 'ERROR'; message: string }
    | { type: 'DONE' };

// RAG and Note Management Types
export interface NoteChunk {
    noteId: string;
    content: string;
    score: number; // Cosine similarity score
};

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
};

export interface IEmbeddingService {
    getVector(content: string): Promise<Vector>;
    terminate?(): void;
};

export interface ILLMService {
    streamChat(
        question: string,
        context: string[],
        onChunk: (chunk: string) => void,
        onError: (error: string) => void,
        onDone: () => void
    ): Promise<void>;
};