"use client";

import { Globe, Lock, Copy, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BaseCard } from "@/shared/components/base-card";
import { NoteDropdownMenu, NoteContextMenuContent } from "./note-menus";
import { useNoteActions } from "../hooks/use-note-actions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface NoteResponseDto {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  hasUnpublishedChanges: boolean;
}

export const NoteCard = ({ note: initialNote }: { note: NoteResponseDto }) => {
  const [note, setNote] = useState(initialNote);

  // Keep local state in sync if parent updates the note
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "notePage"]);

  const handleViewNote = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  const [copied, setCopied] = useState(false);

  const copySlug = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${origin}/notes/public/${note.slug}`);
    setCopied(true);
    toast.success(t("notePage:slugCopyied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const actionsBag = useNoteActions({
    noteId: note.id,
    initialTitle: note.title,
    initialIsPublic: note.isPublic,
    onRenameSuccess: (newTitle) => setNote(prev => ({ ...prev, title: newTitle })),
    onAccessChangeSuccess: (newIsPublic) => setNote(prev => ({ ...prev, isPublic: newIsPublic }))
  });

  const actions = (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <div className="hidden sm:block text-right mr-4">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t("common:status.status")}</p>
        <div className="flex items-center gap-1.5 justify-end">
          {note.isPublic ? <Globe className="h-3 w-3 text-blue-500" /> : <Lock className="h-3 w-3 text-amber-500" />}
          <span className="text-sm font-medium">{note.isPublic ? t("common:status.public") : t("common:status.private")}</span>
        </div>
      </div>

      <NoteDropdownMenu noteId={note.id} actionsBag={actionsBag} />
    </div>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <BaseCard actions={actions} onClick={() => handleViewNote(note.id)}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold truncate text-lg max-w-[200px]">{note.title}</h3>
            {note.hasUnpublishedChanges && (
              <Badge variant="secondary" className="text-[10px] uppercase">{t("common:status.draft")}</Badge>
            )}
          </div>

          {/* Copyable Slug Area */}
          <div
            onClick={copySlug}
            className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors w-fit"
          >
            <span className="font-mono bg-muted/50 px-2 py-0.5 rounded text-xs">/{note.slug}</span>
            {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </div>
        </BaseCard>
      </ContextMenuTrigger>
      
      <NoteContextMenuContent noteId={note.id} actionsBag={actionsBag} />
      {actionsBag.dialogs}
    </ContextMenu>
  );
};
