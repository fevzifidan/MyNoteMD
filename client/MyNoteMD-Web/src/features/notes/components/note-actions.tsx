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
import { MoreHorizontal, Eye, Pencil, Trash2, ShieldCheck, Save, Package } from "lucide-react";

import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { useNavigate } from "react-router-dom";
import { noteService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { MoveNoteDialog } from "./move-not-dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface NoteActionsProps {
  initialIsPublic: boolean;
  noteId: string;
}

export const NoteActions = ({ initialIsPublic, noteId }: NoteActionsProps) => {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation(["common", "noteActions"]);

  const confirm = useConfirm();
  const navigate = useNavigate();

  const handlePublishDraft = async () => {
    setIsUpdating(true);

    try {
      const ok = await confirm.confirm({
        title: t("noteActions:handlePublishDraft.title"),
        description: t("noteActions:handlePublishDraft.description"),
        confirmText: t("common:actions.yes"),
        variant: "destructive",
        size: "sm",
        icon: <Pencil />,
        iconSize: "md",
        dontAskAgain: { id: "save-draft-as-final", label: t("common:choices.doNotAskAgain") }
      });

      if (ok) {
        await noteService.publish(noteId);
        notificationService.info(t("noteActions:handlePublishDraft.successful"));
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
        title: t("noteActions:handleAccessChange.title"),
        description: t("noteActions:handleAccessChange.description"),
        confirmText: t("common:actions.yes"),
        variant: "destructive",
        size: "sm",
        icon: <ShieldCheck />,
        iconSize: "md",
        dontAskAgain: { id: "update-access-note", label: t("common:choices.doNotAskAgain") }
      });

      if (ok) {
        await noteService.toggleVisibility(noteId);
        setIsPublic(checked);
        notificationService.info(t("noteActions:handleAccessChange.successful"));
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
        title: t("noteActions:handleDelete.title"),
        description: t("noteActions:handleDelete.description"),
        confirmText: t("common:actions.yes"),
        variant: "destructive",
        size: "sm",
        icon: <Trash2 />,
        iconSize: "md",
        dontAskAgain: { id: "delete-note", label: t("common:choices.doNotAskAgain") }
      });

      if (ok) {
        await noteService.delete(noteId);
        notificationService.info(t("noteActions:handleDelete.successful"));
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
            <span className="font-medium text-sm">{t("noteActions:read")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => navigate(`/edit/${noteId}`)}>
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:edit")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => handlePublishDraft()}>
            <Save className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:saveAsFinal")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => setIsMoveDialogOpen(true)}
          >
            <Package className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:move")}</span>
          </DropdownMenuItem>

          {/* ACCESS SWITCH AREA */}
          <div
            className="flex items-center justify-between px-2 py-2.5"
            // Prevent Dropdown from closing when Switch is clicked
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={isPublic ? "h-4 w-4 text-blue-500" : "h-4 w-4 opacity-70"} />
              <span className="font-medium text-sm">{t("noteActions:access")}</span>
            </div>

            <Switch
              checked={isPublic}
              disabled={isUpdating}
              // onCheckedChange gives us the new boolean value directly
              onCheckedChange={handleAccessChange}
              className="scale-75 origin-right"
            />
          </div>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">{t("noteActions:delete")}</span>
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