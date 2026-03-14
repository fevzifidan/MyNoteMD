import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Eye, Trash2, Pencil } from "lucide-react";

import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { useNavigate } from "react-router-dom";

import notificationService from "@/shared/services/notification";
import apiService from "@/shared/services/api";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CollectionActionsProps {
  collectionId: string;
}

export const CollectionActions = ({ collectionId }: CollectionActionsProps) => {
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const confirm = useConfirm();

  const handleView = async (e: React.MouseEvent): Promise<void> => {
    navigate(`/collection/notes?collectionId=${collectionId}`);
  }

  const handleDelete = async () => {
    setIsUpdating(true);

    try {
      const ok = await confirm.confirm({
        title: "Delete Collection",
        description: "Are you sure you want to delete this collection and all its notes?",
        confirmText: "Yes",
        variant: "destructive",
        size: "sm",
        icon: <Trash2 />,
        iconSize: "md",
        dontAskAgain: { id: "delete-collection", label: "Don't ask this again" }
      });

      if (ok) {
        await apiService.delete(`/collections/${collectionId}`);
        notificationService.info("Collection deleted successfully.");
      }
    } catch (error) {

    } finally {
      setIsUpdating(false);
    }
  };

  const updateName = async (newName: string) => {
    setIsUpdating(true);

    try {
      await apiService.patch(`/collections/${collectionId}`, { name: newName });
      notificationService.info("Collection name updated successfully.");
    } catch (error) {

    } finally {
      setIsUpdating(false);
    }
  }

  const handleNameUpdate = () => {
    setNewName("");
    setIsRenameOpen(true);
  }

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-52 p-2 rounded-xl shadow-2xl border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            onClick={handleView}
            className="gap-3 py-2.5 cursor-pointer rounded-lg">
            <Eye className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Koleksiyonu Aç</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleNameUpdate}
            className="gap-3 py-2.5 cursor-pointer rounded-lg">
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Yeniden Adlandır</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={handleDelete}
            className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">Sil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Collection Name</DialogTitle>
            <DialogDescription>
              Enter a new name for this collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">New Collection Name</Label>
              <Input
                id="name"
                placeholder="e.g. Travel Plans, Work Projects"
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isUpdating || !newName.trim()}
              onClick={async () => {
                await updateName(newName);
                setIsRenameOpen(false);
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};