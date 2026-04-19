"use client";

import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CollectionDropdownMenu, CollectionContextMenuContent } from "./collection-menus";
import { useCollectionActions } from "../hooks/use-collection-actions";
import { BaseRow } from "@/shared/components/base-row";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface CollectionRowProps {
  id: string;
  name: string;
  noteCount: number;
  lastUpdate: string;
}

export const CollectionRow = ({ id, name, noteCount, lastUpdate }: CollectionRowProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('collectionActions');

  const handleItemClick = (): void => {
    navigate(`/collection/notes?collectionId=${id}`);
  };

  const actionsBag = useCollectionActions({ collectionId: id });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <BaseRow
          onClick={handleItemClick}
          icon={<Folder className="h-5 w-5" />}
          actions={<CollectionDropdownMenu collectionId={id} actionsBag={actionsBag} />}
        >
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-none mb-1">
          {name}
          <span className="text-muted-foreground/50 ml-1 font-normal">
            {t('row.noteCount', { count: noteCount })}
          </span>
        </span>
        <span className="text-xs text-muted-foreground text-left font-medium opacity-70">
          {t('row.updatedAt')} {lastUpdate || "—"}
        </span>
      </div>
    </BaseRow>
    </ContextMenuTrigger>

    <CollectionContextMenuContent collectionId={id} actionsBag={actionsBag} />
    {actionsBag.dialogs}
  </ContextMenu>
  );
};
