"use client";

import { CollectionResponseDto } from "../types";
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

export const CollectionListItem = ({ collection }: { collection: CollectionResponseDto }) => {
  const navigate = useNavigate();

  // Tarihi formatlayalım
  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(collection.createdAt));

  const handleItemClick = async (e: React.MouseEvent):Promise<void> => {
    navigate(`/collection/notes?collectionId=${collection.id}`);
  }

  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-card border hover:shadow-lg hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-5">
        {/* İkon Kutusu */}
        <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Folder className="h-7 w-7" />
        </div>

        <div className="space-y-1">
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
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Aksiyonlar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={handleItemClick}
              className="gap-2 py-2.5">
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
      </div>
    </div>
  );
};