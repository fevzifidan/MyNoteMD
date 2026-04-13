import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { noteService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { MoveNoteDialog } from "../components/move-not-dialog";
import { RenameNoteDialog } from "../components/rename-note-dialog";
import React from "react";

export interface UseNoteActionsProps {
  noteId: string;
  initialTitle: string;
  initialIsPublic: boolean;
  onRenameSuccess?: (newTitle: string) => void;
  onAccessChangeSuccess?: (newIsPublic: boolean) => void;
}

export function useNoteActions({
  noteId,
  initialTitle,
  initialIsPublic,
  onRenameSuccess,
  onAccessChangeSuccess,
}: UseNoteActionsProps) {
  const { t } = useTranslation(["common", "noteActions"]);
  const confirm = useConfirm();

  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        dontAskAgain: { id: "save-draft-as-final", label: t("common:choices.doNotAskAgain") },
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
        description: t("noteActions:handleAccessChange.description", {
          status: checked ? t("common:status.public") : t("common:status.private"),
        }),
        confirmText: t("common:actions.yes"),
        variant: "destructive",
        size: "sm",
        icon: <ShieldCheck />,
        iconSize: "md",
        dontAskAgain: { id: "update-access-note", label: t("common:choices.doNotAskAgain") },
      });

      if (ok) {
        await noteService.toggleVisibility(noteId);
        setIsPublic(checked);
        notificationService.info(t("noteActions:handleAccessChange.successful"));
        if (onAccessChangeSuccess) {
          onAccessChangeSuccess(checked);
        }
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
        dontAskAgain: { id: "delete-note", label: t("common:choices.doNotAskAgain") },
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

  const dialogs = (
    <React.Fragment>
      <MoveNoteDialog
        noteId={noteId}
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
      />
      <RenameNoteDialog
        noteId={noteId}
        initialTitle={initialTitle}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onRenameSuccess={onRenameSuccess}
      />
    </React.Fragment>
  );

  return {
    isPublic,
    isUpdating,
    isDropdownOpen,
    setIsDropdownOpen,
    isMoveDialogOpen,
    setIsMoveDialogOpen,
    isRenameDialogOpen,
    setIsRenameDialogOpen,
    handlePublishDraft,
    handleAccessChange,
    handleDelete,
    dialogs,
  };
}
