import React, { useRef, useEffect } from "react";
import MarkdownPreview from "@/pages/Note/shared/MarkdownPreview";
import { type Message } from "../hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface ChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
    isSyncing: boolean;
    modelLoading: { active: boolean; progress: number; text: string };
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading, isSyncing, modelLoading }) => {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, isLoading, isSyncing]);

    return (
        <ScrollArea className="flex-1 p-4 min-h-0">
            <div className="space-y-4">
                {messages.length === 0 && !isSyncing && (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        {t("ai:welcome")}
                    </div>
                )}

                {isSyncing && (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground animate-pulse">{t("ai:syncing")}</span>
                        <Skeleton className="h-20 w-full" />
                    </div>
                )}

                {modelLoading.active && (
                    <div className="flex flex-col gap-2 p-3 bg-muted rounded-xl border border-primary/20">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{t("ai:modelLoading")}</span>
                            <span className="font-mono">{Math.round(modelLoading.progress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${modelLoading.progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 truncate">{modelLoading.text}</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl ${msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-muted rounded-tl-none"
                                }`}
                        >
                            {msg.role === "user" ? (
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <MarkdownPreview markdown={msg.content} />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
};
