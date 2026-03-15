"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { noteService, collectionService } from "@/shared/services/api";
import { NoteCard } from "@/features/notes/components/note-card";
import { SharedPagination } from "@/shared/components/shared-pagination";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ChatBar } from "@/features/chatbar/components/ChatBar";

export default function NotesPage({ forCollection }: { forCollection?: boolean }) {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("q") || "";
  const collectionId = forCollection ? searchParams.get("collectionId") : "";

  // State Yönetimi
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Önceki sayfalara dönebilmek için cursor geçmişini tutan stack
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const fetchNotes = useCallback(async (cursor: string | null, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      // API İsteği
      const params = {
        cursor: cursor,
        ...(typeof forCollection !== undefined && { search: searchParam })
      };

      const response = await (forCollection === true && collectionId
        ? collectionService.getNotes(collectionId, params)
        : noteService.list(params));

      const data = response as any;
      setNotes(data.items || []);
      setNextCursor(data.nextCursor || null);

      if (isNewSearch) {
        setCurrentPage(1);
        setCursorStack([null]);
      }
    } catch (error) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [searchParam]);

  // Arama terimi (query) her değiştiğinde listeyi sıfırla ve baştan ara
  useEffect(() => {
    fetchNotes(null, true);
  }, [searchParam, fetchNotes]);

  // Sonraki Sayfa
  const handleNext = () => {
    if (nextCursor) {
      // Mevcut nextCursor'ı geçmişe ekle
      setCursorStack((prev) => [...prev, nextCursor]);
      setCurrentPage((prev) => prev + 1);
      fetchNotes(nextCursor);
    }
  };

  // Önceki Sayfa
  const handlePrevious = () => {
    if (currentPage > 1) {
      // Stack'ten son cursor'ı çıkar ve bir öncekini kullan
      const newStack = [...cursorStack];
      newStack.pop(); // Mevcut sayfanın cursor'ını at
      const prevCursor = newStack[newStack.length - 1]; // Önceki sayfanın cursor'ını al

      setCursorStack(newStack);
      setCurrentPage((prev) => prev - 1);
      fetchNotes(prevCursor);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[400px]">
        {/* AI Butonu - Sağ Üstte (Sadece koleksiyon modunda) */}
        {forCollection && collectionId && (
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="group flex items-center gap-2 rounded-full px-6 shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              <span>AI Asistan</span>
            </Button>
          </div>
        )}

        {/* Yükleme Durumu (Loading State) */}
        {loading && notes.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>

            {/* Not Listesi */}
            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <NoteCard key={note.Id || note.id} note={note} />
              ))}
            </div>

            {/* Boş Liste Durumu (Empty State) */}
            {!loading && notes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-[3rem] border-muted/40">
                <p className="text-xl font-medium text-muted-foreground">
                  {searchParam ? `"${searchParam}" ile eşleşen not bulunamadı.` : "Henüz bir notunuz yok."}
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Yeni bir not oluşturarak başlayabilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sayfalama (Pagination) - Sadece veri varsa göster */}
        {notes.length > 0 && (
          <div className="mt-10 mb-20">
            <SharedPagination
              currentPage={currentPage}
              hasNextPage={!!nextCursor}
              onNext={handleNext}
              onPrevious={handlePrevious}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* AI Chat Panel */}
      {forCollection && (
        <ChatBar 
          collectionId={collectionId} 
          open={isChatOpen} 
          onOpenChange={setIsChatOpen} 
        />
      )}
    </DashboardLayout>
  );
}