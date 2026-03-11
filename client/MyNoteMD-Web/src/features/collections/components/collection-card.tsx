"use client";

import { Folder, MoreVertical, Eye, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BaseCard } from "@/shared/components/base-card";

// Note: If types.ts is not found during build, this might need adjustment
export interface CollectionResponseDto {
  id: string;
  name: string;
  noteCount: number;
  createdAt: string;
}

export const CollectionCard = ({ collection }: { collection: CollectionResponseDto }) => {
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(collection.createdAt));

  const handleItemClick = (e: React.MouseEvent): void => {
    navigate(`/collection/notes?collectionId=${collection.id}`);
  };

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleItemClick} className="gap-2 py-2.5">
          <Eye className="h-4 w-4" /> Koleksiyonu Aç
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 py-2.5">
          <Pencil className="h-4 w-4" /> İsim Değiştir
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 py-2.5 text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash2 className="h-4 w-4" /> Koleksiyonu Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <BaseCard 
      icon={<Folder className="h-7 w-7" />}
      actions={actions}
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
