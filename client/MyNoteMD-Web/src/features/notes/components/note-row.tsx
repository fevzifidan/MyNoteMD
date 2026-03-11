"use client";

import { FileText, Globe, Lock } from "lucide-react";
import { NoteActions } from "./note-actions";
import { useNavigate } from "react-router-dom";
import { BaseRow } from "@/shared/components/base-row";

interface NoteRowProps {
  id: string;
  title: string;
  status: "Public" | "Private";
  lastUpdated: string;
}

export const NoteRow = ({ id, title, status, lastUpdated }: NoteRowProps) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate(`/notes/${id}`);
  };

  return (
    <BaseRow
      onClick={handleItemClick}
      icon={<FileText className="h-5 w-5" />}
      actions={<NoteActions initialIsPublic={status === "Public"} noteId={id} />}
    >
      <p className="text-sm text-left font-semibold leading-none tracking-tight">{title}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium opacity-80">
        <span className="flex items-center gap-1">
          {status === "Public" ? (
            <Globe className="h-3 w-3" />
          ) : (
            <Lock className="h-3 w-3" />
          )}
          {status}
        </span>
        <span>•</span>
        <span>Last updated: {lastUpdated}</span>
      </div>
    </BaseRow>
  );
};
