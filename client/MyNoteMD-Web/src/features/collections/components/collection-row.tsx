"use client";

import { Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CollectionActions } from "./collection-actions";
import { BaseRow } from "@/shared/components/base-row";
import { useTranslation } from "react-i18next";

interface CollectionRowProps {
  id: string;
  name: string;
  noteCount: number;
  createdAt: string;
}

export const CollectionRow = ({ id, name, noteCount, createdAt }: CollectionRowProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('collectionActions');

  const handleItemClick = (): void => {
    navigate(`/collection/notes?collectionId=${id}`);
  };

  return (
    <BaseRow
      onClick={handleItemClick}
      icon={<Folder className="h-5 w-5" />}
      actions={<CollectionActions collectionId={id} />}
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-none mb-1">
          {name}
          <span className="text-muted-foreground/50 ml-1 font-normal">
            {t('row.noteCount', { count: noteCount })}
          </span>
        </span>
        <span className="text-xs text-muted-foreground text-left font-medium opacity-70">
          {t('row.createdAt')} {createdAt}
        </span>
      </div>
    </BaseRow>
  );
};
