import * as webllm from "@mlc-ai/web-llm";
import type { ChatRequest } from "../types";

let engine: webllm.MLCEngine | null = null;

const initEngine = async () => {
    if (engine) return;

    // GPU Kontrolü
    if (!(navigator as any).gpu) {
        throw new Error("Tarayıcınız WebGPU'yu desteklemiyor veya devre dışı. Lütfen Chrome/Edge gibi güncel bir tarayıcı kullanın ve ayarlarınızdan 'Donanım Hızlandırma'nın açık olduğundan emin olun.");
    }

    try {
        engine = new webllm.MLCEngine();
        engine.setInitProgressCallback((report) => {
            self.postMessage({ type: 'PROGRESS', progress: report.progress, text: report.text });
        });
        // Phi-3-mini'yi tarayıcıya indirip yükle
        await engine.reload("Phi-3-mini-4k-instruct-q4f16_1-MLC");
    } catch (error: any) {
        console.error("GPU Başlatma Hatası:", error);
        if (error.message?.includes("compatible GPU")) {
            throw new Error("Uyumlu bir GPU bulunamadı. WebLLM için modern bir ekran kartı gereklidir. chrome://gpu sayfasındaki WebGPU durumunu kontrol edin.");
        }
        throw error;
    }
};

self.onmessage = async (event: MessageEvent<ChatRequest>) => {
    if (event.data.type === 'GENERATE_CHAT') {
        const { question, context } = event.data;
        
        try {
            await initEngine();

            // RAG Prompt Mühendisliği
            const prompt = `Aşağıdaki notları kullanarak soruyu cevapla. Notlarda cevap yoksa uydurma ve "Notlarınızda bu konuda bilgi bulamadım" de.
            
            NOTLAR:
            ${context.join('\n---\n')}
            
            SORU: ${question}`;

            const asyncGenerator = await engine!.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                stream: true,
            });

            for await (const chunk of asyncGenerator) {
                const content = chunk.choices[0].delta.content;
                if (content) {
                    self.postMessage({ type: 'CHUNK', content });
                }
            }
            self.postMessage({ type: 'DONE' });
        } catch (error: any) {
            self.postMessage({ type: 'ERROR', message: error.message || "Bilinmeyen bir AI hatası oluştu." });
        }
    }
};