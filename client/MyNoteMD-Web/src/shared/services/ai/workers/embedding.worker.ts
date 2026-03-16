/// <reference lib="webworker" />
import { pipeline } from "@huggingface/transformers";
import { type EmbeddingRequest, type EmbeddingResponse, type EmbeddingError } from "../types";

// Define model globally
let pipe: any = null;

// configuration from environment variables
const EMBEDDING_MODEL_ID = import.meta.env.VITE_AI_EMBEDDING_MODEL_ID || "Xenova/all-MiniLM-L6-v2";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<EmbeddingRequest>) => {
    const { type, content } = event.data;

    if (type === "CALCULATE_EMBEDDING") {
        try {
            // Load model if not loaded
            if (!pipe) {
                pipe = await pipeline("feature-extraction", EMBEDDING_MODEL_ID, {
                    device: 'wasm'
                });
            }
            const output = await pipe(content, { pooling: 'mean', normalize: true });
            const vector = output.data as Float32Array;

            const response: EmbeddingResponse = {
                type: 'EMBEDDING_RESULT',
                vector
            };

            workerScope.postMessage(response, [vector.buffer]);
        } catch (error) {
            const errorResponse: EmbeddingError = {
                type: 'EMBEDDING_ERROR',
                error: error instanceof Error ? error.message : String(error)
            };
            workerScope.postMessage(errorResponse);
        }
    };
};

