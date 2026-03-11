"use client";

import { MoreVertical, Eye, Trash2, Globe, Lock, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { BaseCard } from "@/shared/components/base-card";

interface NoteResponseDto {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  hasUnpublishedChanges: boolean;
}

export const NoteCard = ({ note }: { note: NoteResponseDto }) => {
  const [copied, setCopied] = useState(false);

  const copySlug = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.slug);
    setCopied(true);
    toast.success("Slug copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <div className="hidden sm:block text-right mr-4">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Status</p>
        <div className="flex items-center gap-1.5 justify-end">
          {note.isPublic ? <Globe className="h-3 w-3 text-blue-500" /> : <Lock className="h-3 w-3 text-amber-500" />}
          <span className="text-sm font-medium">{note.isPublic ? "Public" : "Private"}</span>
        </div>
      </div>

      {/* Action Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="gap-2">
            <Eye className="h-4 w-4" /> View Note
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Globe className="h-4 w-4" /> Change Visibility
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground">
            <Trash2 className="h-4 w-4" /> Delete Note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <BaseCard actions={actions}>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-bold truncate text-lg max-w-[200px]">{note.title}</h3>
        {note.hasUnpublishedChanges && (
          <Badge variant="secondary" className="text-[10px] uppercase">Draft</Badge>
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
  );
};
