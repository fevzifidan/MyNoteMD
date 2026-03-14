import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Eye, Pencil, Trash2, ShieldCheck } from "lucide-react";

import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/shared/services/api/api.service";
import notificationService from "@/shared/services/notification";
import { MoveNoteDialog } from "./move-not-dialog";
import { cn } from "@/lib/utils";

interface NoteActionsProps {
  initialIsPublic: boolean;
  noteId: string;
}

export const NoteActions = ({ initialIsPublic, noteId }: NoteActionsProps) => {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const confirm = useConfirm();
  const navigate = useNavigate();

  const handlePublishDraft = async () => {
    setIsUpdating(true);

    try {
      const ok = await confirm.confirm({
        title: "Save Draft as Final",
        description: "Are you sure you want to save this draft as final?",
        confirmText: "Yes",
        variant: "destructive",
        size: "sm",
        icon: <Pencil />,
        iconSize: "md",
        dontAskAgain: { id: "save-draft-as-final", label: "Don't ask this again" }
      });

      if (ok) {
        await apiService.post(`/notes/${noteId}/publish`, {});
        notificationService.info("Draft saved as final successfully.");
      }
    } catch (error) {

    } finally {
      setIsUpdating(false);
    }
  };

  const handleAccessChange = async (checked: boolean) => {
    setIsUpdating(true);

    try {
      const ok = await confirm.confirm({
        title: "Erişimi Güncelle",
        description: `Bu notun erişimini ${checked ? "Public" : "Private"} olarak güncellemek üzeresiniz. Emin misiniz?`,
        confirmText: "Evet",
        variant: "destructive",
        size: "sm",
        icon: <ShieldCheck />,
        iconSize: "md",
        dontAskAgain: { id: "update-access-note", label: "Bu uyarıyı bir daha gösterme" }
      });

      if (ok) {
        await apiService.post(`/notes/${noteId}/toggle-visibility`, {});
        setIsPublic(checked);
        notificationService.info("Accessibility updated successfully.");
      }
    } catch (error) {

    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);

    try {
      const ok = await confirm.confirm({
        title: "Delete Note",
        description: "Are you sure you want to delete this note?",
        confirmText: "Yes",
        variant: "destructive",
        size: "sm",
        icon: <Trash2 />,
        iconSize: "md",
        dontAskAgain: { id: "delete-note", label: "Don't ask this again" }
      });

      if (ok) {
        await apiService.delete(`/notes/${noteId}`);
        notificationService.info("Note deleted successfully.");
      }
    } catch (error) {

    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={cn(
      "flex items-center",
      (isMenuOpen || isMoveDialogOpen) ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    )}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 p-0 rounded-full flex items-center justify-center hover:bg-accent/50"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-2xl border-border">
          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => navigate(`/notes/${noteId}`)}>
            <Eye className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Oku</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => navigate(`/edit/${noteId}`)}>
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Düzenle</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => handlePublishDraft()}>
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Save Draft as Final</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => setIsMoveDialogOpen(true)}
          >
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Move</span>
          </DropdownMenuItem>

          {/* ACCESS SWITCH ALANI */}
          <div
            className="flex items-center justify-between px-2 py-2.5"
            // Dropdown'ın Switch'e tıklandığında kapanmasını engeller
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={isPublic ? "h-4 w-4 text-blue-500" : "h-4 w-4 opacity-70"} />
              <span className="font-medium text-sm">Access</span>
            </div>

            <Switch
              checked={isPublic}
              disabled={isUpdating}
              // onCheckedChange bize direkt yeni boolean değeri verir
              onCheckedChange={handleAccessChange}
              className="scale-75 origin-right"
            />
          </div>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">Sil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <MoveNoteDialog
        noteId={noteId}
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
      />
    </div>
  );
};