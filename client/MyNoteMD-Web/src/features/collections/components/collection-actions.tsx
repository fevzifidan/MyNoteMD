import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2, Trash } from "lucide-react";

import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { useNavigate } from "react-router-dom";

interface CollectionActionsProps {
  collectionId: string;
}

export const CollectionActions = ({ collectionId }: CollectionActionsProps) => {
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);
  
  const confirm = useConfirm();

  const handleView = async (e: React.MouseEvent):Promise<void> => {
    navigate(`/collection/notes?collectionId=${collectionId}`);
  }

  const handleDelete = async (e: React.MouseEvent):Promise<void> => {
    e.stopPropagation();
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const ok = await confirm.confirm({
        title: "Koleksiyonu Sil",
        description: `Bu koleksiyonu silerseniz içindeki tüm notları kaybedersiniz. Emin misiniz?`,
        confirmText: "Evet",
        variant: "destructive",
        size: "sm",
        icon: <Trash />,
        iconSize: "md",
        dontAskAgain: { id: "update-access-note", label: "Bu uyarıyı bir daha gösterme" }
      });

      if (ok) {
        console.log("Silme işlemi başarılı!");
      } else {
        // Kullanıcı iptal ettiyse hiçbişey yapmıyoruz. 
        // isPublic değişmediği için Switch eski halinde kalır.
        console.log("Silme işlemi iptal edildi.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    } finally {
      setIsUpdating(false);
    }
  };

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
            <span className="font-medium text-sm">Görüntüle</span>
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
    </div>
  );
};