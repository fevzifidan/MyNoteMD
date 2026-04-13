"use client";

import { Folder, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BaseCard } from "@/shared/components/base-card";
import { CollectionDropdownMenu, CollectionContextMenuContent } from "./collection-menus";
import { useCollectionActions } from "../hooks/use-collection-actions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

// Note: If types.ts is not found during build, this might need adjustment
export interface CollectionResponseDto {
  id: string;
  name: string;
  noteCount: number;
  createdAt: string;
}

export const CollectionCard = ({ collection }: { collection: CollectionResponseDto }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('collectionActions');

  const handleViewCollection = (collectionId: string) => {
    navigate(`/collection/notes?collectionId=${collectionId}`);
  };

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(collection.createdAt));

  const actionsBag = useCollectionActions({ collectionId: collection.id });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <BaseCard
          icon={<Folder className="h-7 w-7" />}
          actions={<CollectionDropdownMenu collectionId={collection.id} actionsBag={actionsBag} />}
          onClick={() => handleViewCollection(collection.id)}
        >
      <h3 className="font-bold text-xl tracking-tight leading-none">
        {collection.name}
      </h3>
      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5">
          <Badge variant="secondary" className="rounded-md font-bold">
            {t('card.noteCount', { count: collection.noteCount })}
          </Badge>
        </span>
        <span className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </span>
      </div>
    </BaseCard>
    </ContextMenuTrigger>

    <CollectionContextMenuContent collectionId={collection.id} actionsBag={actionsBag} />
    {actionsBag.dialogs}
  </ContextMenu>
  );
};
