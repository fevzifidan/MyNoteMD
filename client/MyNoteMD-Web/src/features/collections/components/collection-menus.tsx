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
import { MoreHorizontal, Eye, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CollectionDropdownMenu({
  collectionId,
  actionsBag,
}: {
  collectionId: string;
  actionsBag: any;
}) {
  const { t } = useTranslation("collectionActions");
  const navigate = useNavigate();

  const handleView = () => navigate(`/collection/notes?collectionId=${collectionId}`);

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <DropdownMenu open={actionsBag.isDropdownOpen} onOpenChange={actionsBag.setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full flex items-center justify-center"
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
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
          >
            <Eye className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("actions.open")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              actionsBag.setNewName("");
              actionsBag.setIsRenameOpen(true);
            }}
            className="gap-3 py-2.5 cursor-pointer rounded-lg"
          >
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">{t("actions.rename")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={actionsBag.handleDelete}
            className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">{t("actions.delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CollectionContextMenuContent({
  collectionId,
  actionsBag,
}: {
  collectionId: string;
  actionsBag: any;
}) {
  const { t } = useTranslation("collectionActions");
  const navigate = useNavigate();

  const handleView = () => navigate(`/collection/notes?collectionId=${collectionId}`);

  return (
    <ContextMenuContent
      className="w-52 p-2 rounded-xl shadow-2xl border-border"
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenuItem
        onClick={handleView}
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
      >
        <Eye className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("actions.open")}</span>
      </ContextMenuItem>

      <ContextMenuItem
        onClick={() => {
          actionsBag.setNewName("");
          actionsBag.setIsRenameOpen(true);
        }}
        className="gap-3 py-2.5 cursor-pointer rounded-lg"
      >
        <Pencil className="h-4 w-4 opacity-70" />
        <span className="font-medium text-sm">{t("actions.rename")}</span>
      </ContextMenuItem>

      <ContextMenuSeparator className="my-2" />

      <ContextMenuItem
        onClick={actionsBag.handleDelete}
        className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
        <span className="font-bold text-sm">{t("actions.delete")}</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
