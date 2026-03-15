import { type EmbeddingRequest, type EmbeddingResponse, type Vector } from "../types";

export class EmbeddingService {
    private worker: Worker;

    constructor() {
        this.worker = new Worker(new URL('../workers/embedding.worker', import.meta.url), { type: 'module' });
    }

    public async getVector(content: string): Promise<Vector> {
        return new Promise((resolve, reject) => {
            this.worker.onmessage = (event: MessageEvent<EmbeddingResponse>) => {
                if (event.data.type === 'EMBEDDING_RESULT') {
                    resolve(event.data.vector);
                }
                if (event.data.type === 'EMBEDDING_ERROR') {
                    reject(event.data.error);
                }
            };
            this.worker.postMessage({
                type: 'CALCULATE_EMBEDDING',
                content
            } as EmbeddingRequest);
        });
    }
}