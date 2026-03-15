import { useState, useCallback, useRef, useEffect } from "react";
import { syncService } from "@/shared/services/ai/services/SyncService";
import { searchRelevantNotes } from "@/shared/services/ai/services/search.service";
import type { ChatRequest } from "@/shared/services/ai/types";

export interface Message {
    role: "user" | "ai";
    content: string;
}

export function useChat(collectionId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [modelLoading, setModelLoading] = useState({ active: false, progress: 0, text: "" });
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        const setupWorkerEvents = (worker: Worker) => {
            worker.onmessage = (event) => {
                const { type, content, progress, text, message } = event.data;
                if (type === "PROGRESS") {
                    setModelLoading({ active: true, progress: progress * 100, text });
                } else if (type === "CHUNK") {
                    setModelLoading({ active: false, progress: 100, text: "Hazır" });
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage && lastMessage.role === "ai") {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                content: lastMessage.content + content,
                            };
                            return newMessages;
                        }
                        return [...prev, { role: "ai", content }];
                    });
                } else if (type === "ERROR") {
                    setModelLoading({ active: false, progress: 0, text: "" });
                    setIsLoading(false);
                    setMessages((prev) => [...prev, { role: "ai", content: `❌ **Hata:** ${message || "AI servisi başlatılamadı."}` }]);
                } else if (type === "DONE") {
                    setIsLoading(false);
                }
            };
        };

        workerRef.current = new Worker(
            new URL("@/shared/services/ai/services/llm.service.ts", import.meta.url),
            { type: "module" }
        );
        setupWorkerEvents(workerRef.current);

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const stopChat = useCallback(() => {
        // 1. Workers durdur
        workerRef.current?.terminate();
        syncService.stop();

        // 2. Yeni worker yarat ki sonraki isteklerde çalışabilsin
        workerRef.current = new Worker(
            new URL("@/shared/services/ai/services/llm.service.ts", import.meta.url),
            { type: "module" }
        );
        
        // worker.onmessage'ı tekrar setupla (useEffect içindeki mantık ile aynı)
        const setupWorkerEvents = (worker: Worker) => {
            worker.onmessage = (event) => {
                const { type, content, progress, text, message } = event.data;
                if (type === "PROGRESS") {
                    setModelLoading({ active: true, progress: progress * 100, text });
                } else if (type === "CHUNK") {
                    setModelLoading({ active: false, progress: 100, text: "Hazır" });
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage && lastMessage.role === "ai") {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                content: lastMessage.content + content,
                            };
                            return newMessages;
                        }
                        return [...prev, { role: "ai", content }];
                    });
                } else if (type === "ERROR") {
                    setModelLoading({ active: false, progress: 0, text: "" });
                    setIsLoading(false);
                    setMessages((prev) => [...prev, { role: "ai", content: `❌ **Hata:** ${message || "AI servisi başlatılamadı."}` }]);
                } else if (type === "DONE") {
                    setIsLoading(false);
                }
            };
        };
        setupWorkerEvents(workerRef.current);

        // 3. Stateleri sıfırla
        setIsLoading(false);
        setIsSyncing(false);
        setModelLoading({ active: false, progress: 0, text: "" });
    }, []);

    const sendMessage = useCallback(async (question: string) => {
        if (!collectionId || !question.trim() || isLoading) return;

        // 1. Kullanıcı mesajını ekle
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setIsLoading(true);

        try {
            // 2. Senkronizasyon
            setIsSyncing(true);
            await syncService.syncCollection(collectionId);
            setIsSyncing(false);

            // 3. RAG: İlgili notları bul
            const relevantNotes = await searchRelevantNotes(question, collectionId);
            const context = relevantNotes.map(n => n.content);

            // 4. LLM'e gönder
            workerRef.current?.postMessage({
                type: "GENERATE_CHAT",
                question,
                context
            } as ChatRequest);

        } catch (error) {
            console.error("Chat hatası:", error);
            setMessages((prev) => [...prev, { role: "ai", content: "Bir hata oluştu. Lütfen tekrar deneyin." }]);
        } finally {
            setIsLoading(false);
            setIsSyncing(false);
        }
    }, [collectionId, isLoading, stopChat]);

    const clearMessages = () => setMessages([]);

    return {
        messages,
        sendMessage,
        stopChat,
        isLoading,
        isSyncing,
        modelLoading,
        clearMessages
    };
}
