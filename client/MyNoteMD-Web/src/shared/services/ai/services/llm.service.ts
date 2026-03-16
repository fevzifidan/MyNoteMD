import { pipeline, env, TextStreamer } from "@huggingface/transformers";
import type { ChatRequest } from "../types";

// Transformers.js environment configuration
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: any = null;
let initPromise: Promise<void> | null = null;

// configuration from environment variables
const MODEL_ID = import.meta.env.VITE_AI_MODEL_ID || "onnx-community/Qwen2.5-1.5B-Instruct";
const DTYPE = import.meta.env.VITE_AI_DTYPE || 'q8';
const MAX_NEW_TOKENS = Number(import.meta.env.VITE_AI_MAX_NEW_TOKENS) || 25;
const TEMPERATURE = Number(import.meta.env.VITE_AI_TEMPERATURE) || 0.1;
const REPETITION_PENALTY = Number(import.meta.env.VITE_AI_REPETITION_PENALTY) || 1.1;
const DEVICE = import.meta.env.VITE_AI_DEVICE || 'wasm';
const DO_SAMPLE = Boolean(import.meta.env.VITE_AI_DO_SAMPLE) || false;
const TOP_K = Number(import.meta.env.VITE_AI_TOP_K) || 40;
const VITE_AI_SYSTEM_PROMPT = import.meta.env.VITE_AI_SYSTEM_PROMPT || '';

const initEngine = async () => {
    if (generator) return;
    if (initPromise) {
        return initPromise;
    }

    initPromise = (async () => {
        try {
            generator = await pipeline('text-generation', MODEL_ID, {
                dtype: DTYPE,
                device: DEVICE,
                progress_callback: (report: any) => {
                    if (report.status === 'progress') {
                        const progress = report.progress / 100;
                        const text = report.file ? `İndiriliyor: ${report.file}` : report.status;
                        self.postMessage({ type: 'PROGRESS', progress, text });
                    } else if (report.status === 'done') {
                        self.postMessage({ type: 'PROGRESS', progress: 1, text: "Yüklendi" });
                    }
                }
            });
        } catch (error: any) {
            console.error("Transformers.js Başlatma Hatası:", error);
            initPromise = null;
            throw error;
        }
    })();

    return initPromise;
};

self.onmessage = async (event: MessageEvent<ChatRequest>) => {
    if (event.data.type === 'GENERATE_CHAT') {
        const { question, context } = event.data;

        try {
            await initEngine();

            // 1. System Message: Focus on "finding" rather than "rejecting"
            const systemMessage = {
                role: "system",
                content: VITE_AI_SYSTEM_PROMPT
            };

            // 2. User Message: Structural Clarity
            const userMessage = {
                role: "user",
                content: `I have provided my notes below between [START] and [END] tags. 
    Please analyze them and answer the question.
 
[START OF NOTES]
${context.join('\n---\n')}
[END OF NOTES]

Question: ${question}
Answer:`
            };

            // 3. Build the array (Try testing without history first to isolate the issue)
            const messages = [systemMessage, userMessage];

            // Add history if available (limit to last 4 messages to save context)
            if (event.data.history && event.data.history.length > 0) {
                messages.push(...event.data.history.slice(-4));
            }

            const prompt = generator.tokenizer.apply_chat_template(messages, {
                tokenize: false,
                add_generation_prompt: true,
            });

            const streamer = new TextStreamer(generator.tokenizer, {
                skip_prompt: true,
                callback_function: (text: string) => {
                    if (text) {
                        self.postMessage({ type: 'CHUNK', content: text });
                    }
                }
            });

            await generator(prompt, {
                max_new_tokens: MAX_NEW_TOKENS,
                streamer,
                temperature: TEMPERATURE,
                repetition_penalty: REPETITION_PENALTY,
                do_sample: DO_SAMPLE,
                top_k: TOP_K,
            });

            self.postMessage({ type: 'DONE' });
        } catch (error: any) {
            console.error("LLM Service Hatası:", error);
            self.postMessage({ type: 'ERROR', message: error });
        }
    }
};
