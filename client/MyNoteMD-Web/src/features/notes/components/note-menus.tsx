import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Eye, Pencil, Trash2, ShieldCheck, Save, Package, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function NoteDropdownMenu({ 
  noteId, 
  actionsBag, 
}: { 
  noteId: string; 
  actionsBag: any; 
}) {
  const { t } = useTranslation(["common", "noteActions"]);
  const navigate = useNavigate();

  return (
    <div className={cn(
      "flex items-center",
      (actionsBag.isDropdownOpen || actionsBag.isMoveDialogOpen) ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    )}>
      <DropdownMenu open={actionsBag.isDropdownOpen} onOpenChange={actionsBag.setIsDropdownOpen}>
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
            onClick={() => actionsBag.setIsRenameDialogOpen(true)}>
            <Type className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:rename", { defaultValue: "Rename" })}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => actionsBag.handlePublishDraft()}>
            <Save className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:saveAsFinal")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
            onClick={() => actionsBag.setIsMoveDialogOpen(true)}
          >
            <Package className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("noteActions:move")}</span>
          </DropdownMenuItem>

          <div
            className="flex items-center justify-between px-2 py-2.5"
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={actionsBag.isPublic ? "h-4 w-4 text-blue-500" : "h-4 w-4 opacity-70"} />
              <span className="font-medium text-sm">{t("noteActions:access")}</span>
            </div>

            <Switch
              checked={actionsBag.isPublic}
              disabled={actionsBag.isUpdating}
              onCheckedChange={actionsBag.handleAccessChange}
              className="scale-75 origin-right"
            />
          </div>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={actionsBag.handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">{t("noteActions:delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function NoteContextMenuContent({ 
  noteId, 
  actionsBag, 
}: { 
  noteId: string; 
  actionsBag: any; 
}) {
  const { t } = useTranslation(["common", "noteActions"]);
  const navigate = useNavigate();

  return (
    <ContextMenuContent className="w-52 p-2 rounded-xl shadow-2xl border-border">
      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
        onClick={() => navigate(`/notes/${noteId}`)}>
        <Eye className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("noteActions:read")}</span>
      </ContextMenuItem>

      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
        onClick={() => navigate(`/edit/${noteId}`)}>
        <Pencil className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("noteActions:edit")}</span>
      </ContextMenuItem>

      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
        onClick={() => actionsBag.setIsRenameDialogOpen(true)}>
        <Type className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("noteActions:rename", { defaultValue: "Rename" })}</span>
      </ContextMenuItem>

      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
        onClick={() => actionsBag.handlePublishDraft()}>
        <Save className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("noteActions:saveAsFinal")}</span>
      </ContextMenuItem>

      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
        onClick={() => actionsBag.setIsMoveDialogOpen(true)}
      >
        <Package className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("noteActions:move")}</span>
      </ContextMenuItem>

      <div
        className="flex items-center justify-between px-2 py-2.5 cursor-default hover:bg-accent rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className={actionsBag.isPublic ? "h-4 w-4 text-blue-500" : "h-4 w-4 opacity-70"} />
          <span className="font-medium text-sm">{t("noteActions:access")}</span>
        </div>

        <Switch
          checked={actionsBag.isPublic}
          disabled={actionsBag.isUpdating}
          onCheckedChange={actionsBag.handleAccessChange}
          className="scale-75 origin-right"
        />
      </div>

      <ContextMenuSeparator className="my-2" />

      <ContextMenuItem
        className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
        onClick={actionsBag.handleDelete}>
        <Trash2 className="h-4 w-4" />
        <span className="font-bold text-sm">{t("noteActions:delete")}</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
