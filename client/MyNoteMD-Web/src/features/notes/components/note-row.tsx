"use client";

import { Globe, Lock, FileText } from "lucide-react";
import { NoteDropdownMenu, NoteContextMenuContent } from "./note-menus";
import { useNoteActions } from "../hooks/use-note-actions";
import { useNavigate } from "react-router-dom";
import { BaseRow } from "@/shared/components/base-row";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface NoteRowProps {
  id: string;
  title: string;
  status: string;
  lastUpdated: string;
}

import { useState, useEffect } from "react";

export const NoteRow = ({ id, title: initialTitle, status: initialStatus, lastUpdated }: NoteRowProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setTitle(initialTitle);
    setStatus(initialStatus);
  }, [initialTitle, initialStatus]);
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);

  const handleItemClick = () => {
    navigate(`/notes/${id}`);
  };

  const actionsBag = useNoteActions({
    noteId: id,
    initialTitle: title,
    initialIsPublic: status === "Public",
    onRenameSuccess: (newTitle) => setTitle(newTitle),
    onAccessChangeSuccess: (newIsPublic) => setStatus(newIsPublic ? "Public" : "Private")
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <BaseRow
          onClick={handleItemClick}
          icon={<FileText className="h-5 w-5" />}
          actions={<NoteDropdownMenu noteId={id} actionsBag={actionsBag} />}
        >
          <p className="text-sm text-left font-semibold leading-none tracking-tight">{title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium opacity-80">
            <span className="flex items-center gap-1">
              {status.toLocaleLowerCase() === "public" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {t(`common:status.${status.toLocaleLowerCase()}`)}
            </span>
            <span>•</span>
            <span>{t("common:info.lastUpdated")}: {lastUpdated}</span>
          </div>
        </BaseRow>
      </ContextMenuTrigger>
      
      <NoteContextMenuContent noteId={id} actionsBag={actionsBag} />
      {actionsBag.dialogs}
    </ContextMenu>
  );
};
