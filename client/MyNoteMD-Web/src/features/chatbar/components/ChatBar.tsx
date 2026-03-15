import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { ChatMessages } from "./ChatMessages";

interface ChatBarProps {
    collectionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ChatBar: React.FC<ChatBarProps> = ({ collectionId, open, onOpenChange }) => {
    const [input, setInput] = useState("");
    const { messages, sendMessage, stopChat, isLoading, isSyncing, modelLoading, clearMessages } = useChat(collectionId);

    const isBusy = isLoading || isSyncing || modelLoading.active;

    const handleSend = async () => {
        if (!input.trim() || isBusy) return;
        const question = input.trim();
        setInput("");
        await sendMessage(question);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Asistan (Beta)
                        </SheetTitle>
                        <Button variant="ghost" size="sm" onClick={clearMessages} className="text-xs text-muted-foreground" disabled={isBusy}>
                            Temizle
                        </Button>
                    </div>
                </SheetHeader>

                <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    isSyncing={isSyncing}
                    modelLoading={modelLoading}
                />

                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Soru sor..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isBusy}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="flex-1"
                        />
                        {isBusy ? (
                            <Button type="button" size="icon" variant="destructive" onClick={stopChat}>
                                <div className="w-3 h-3 bg-white rounded-sm" />
                            </Button>
                        ) : (
                            <Button type="button" size="icon" onClick={handleSend} disabled={!input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        AI hatalı bilgiler verebilir. Önemli bilgileri kontrol edin.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
};
