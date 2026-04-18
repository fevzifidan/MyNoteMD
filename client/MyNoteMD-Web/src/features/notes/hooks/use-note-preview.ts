import React, { useState, useEffect } from "react";
import apiService from "@/shared/services/api";
import notificationService from "@/shared/services/notification";

interface UseNotePreviewProps {
  id?: string;
  isPublic?: boolean;
}

export const useNotePreview = ({ id, isPublic = false }: UseNotePreviewProps) => {
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const [publishedNote, setPublishedNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contentMode, setContentMode] = useState<'draft' | 'published'>('published');

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      setLoading(true);
      setError(false);
      try {
        const endpoint = isPublic ? `/notes/public/${id}` : `/notes/${id}`;
        // Use silent: true for public/guest views to avoid auth modals
        const res: any = await apiService.get(endpoint, isPublic ? { silent: true } : {});
        
        setDraftNote(res.content || "");
        setPublishedNote(res.publishedContent || "");
        
        // If it's a guest/public view with no draft available, ensure we show published
        if (!res.content && res.publishedContent) {
            setContentMode('published');
        }
      } catch (err: any) {
        setError(true);
        if (!isPublic) {
            notificationService.error(err.message || "Failed to fetch note");
        }
        console.error("Fetch Note Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isPublic]);

  const currentContent = contentMode === 'draft' ? (draftNote || "") : (publishedNote || "");

  return {
    currentContent,
    draftNote,
    publishedNote,
    contentMode,
    setContentMode,
    loading,
    error,
  };
};
