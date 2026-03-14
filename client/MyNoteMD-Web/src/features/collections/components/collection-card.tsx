"use client";

import { Folder, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BaseCard } from "@/shared/components/base-card";
import { CollectionActions } from "./collection-actions";
import { useNavigate } from "react-router-dom";

// Note: If types.ts is not found during build, this might need adjustment
export interface CollectionResponseDto {
  id: string;
  name: string;
  noteCount: number;
  createdAt: string;
}

export const CollectionCard = ({ collection }: { collection: CollectionResponseDto }) => {
  const navigate = useNavigate();

  const handleViewCollection = (collectionId: string) => {
    navigate(`/collection/notes?collectionId=${collectionId}`);
  };

  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(collection.createdAt));

  return (
    <BaseCard
      icon={<Folder className="h-7 w-7" />}
      actions={<CollectionActions collectionId={collection.id} />}
      onClick={() => handleViewCollection(collection.id)}
    >
      <h3 className="font-bold text-xl tracking-tight leading-none">
        {collection.name}
      </h3>
      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
        <span className="flex items-center gap-1.5">
          <Badge variant="secondary" className="rounded-md font-bold">
            {collection.noteCount} Not
          </Badge>
        </span>
        <span className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </span>
      </div>
    </BaseCard>
  );
};
