import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { collectionService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Trash2 } from "lucide-react";
import React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface UseCollectionActionsProps {
  collectionId: string;
}

export function useCollectionActions({ collectionId }: UseCollectionActionsProps) {
  const { t } = useTranslation("collectionActions");
  const confirm = useConfirm();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const ok = await confirm.confirm({
        title: t('delete.title'),
        description: t('delete.description'),
        confirmText: t('delete.confirmText'),
        variant: "destructive",
        size: "sm",
        icon: <Trash2 />,
        iconSize: "md",
        dontAskAgain: { id: "delete-collection", label: t('delete.dontAskAgain') }
      });

      if (ok) {
        await collectionService.delete(collectionId);
        notificationService.info(t('delete.successMessage'));
      }
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const updateName = async (updatedName: string) => {
    setIsUpdating(true);
    try {
      await collectionService.update(collectionId, { name: updatedName });
      notificationService.info(t('rename.successMessage'));
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const dialogs = (
    <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
      <DialogContent onInteractOutside={(e) => {
          // If we had a modal={false}, we would need e.preventDefault()
      }}>
        <DialogHeader>
          <DialogTitle>{t('rename.dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('rename.dialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('rename.nameLabel')}</Label>
            <Input
              id="name"
              placeholder={t('rename.namePlaceholder')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateName(newName);
                  setIsRenameOpen(false);
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('rename.cancelButton')}</Button>
          </DialogClose>
          <Button
            disabled={isUpdating || !newName.trim()}
            onClick={async () => {
              await updateName(newName);
              setIsRenameOpen(false);
            }}
          >
            {t('rename.updateButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    isUpdating,
    isDropdownOpen,
    setIsDropdownOpen,
    isRenameOpen,
    setIsRenameOpen,
    setNewName,
    newName,
    handleDelete,
    dialogs,
  };
}
