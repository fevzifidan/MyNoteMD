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
import { useTranslation } from "react-i18next";

export default function NotesPage({ forCollection }: { forCollection?: boolean }) {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("q") || "";
  const collectionId = forCollection ? searchParams.get("collectionId") : "";
  const { t } = useTranslation(["ai", "notePage", "common"]);

  // States
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Cursor stack to move previous pages
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const fetchNotes = useCallback(async (cursor: string | null, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      // API Request
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

  // Search param changes, reset list and fetch from start
  useEffect(() => {
    fetchNotes(null, true);
  }, [searchParam, fetchNotes]);

  // Next Page
  const handleNext = () => {
    if (nextCursor) {
      // Add current nextCursor to stack
      setCursorStack((prev) => [...prev, nextCursor]);
      setCurrentPage((prev) => prev + 1);
      fetchNotes(nextCursor);
    }
  };

  // Previous Page
  const handlePrevious = () => {
    if (currentPage > 1) {
      // Remove current cursor from stack and use previous one
      const newStack = [...cursorStack];
      newStack.pop(); // Remove current page cursor
      const prevCursor = newStack[newStack.length - 1]; // Get previous page cursor

      setCursorStack(newStack);
      setCurrentPage((prev) => prev - 1);
      fetchNotes(prevCursor);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[400px]">
        {/* AI Button - Right Top (Only in collection mode) */}
        {forCollection && collectionId && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsChatOpen(true)}
              className="group flex items-center gap-2 rounded-full px-6 shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              <span>{t("ai:title")}</span>
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && notes.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>

            {/* Notes List */}
            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <NoteCard key={note.Id || note.id} note={note} />
              ))}
            </div>

            {/* Empty State */}
            {!loading && notes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-[3rem] border-muted/40">
                <p className="text-xl font-medium text-muted-foreground">
                  {searchParam ? `${t("notePage:noResultsFound")}` : t("notePage:doNotHaveNotes")}
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {t("notePage:start")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination - Only show if data exists */}
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