import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Eye, Pencil, Trash2, ShieldCheck } from "lucide-react";

import { useConfirm } from "@/shared/services/confirmation/useConfirm"; 

interface NoteActionsProps {
  initialIsPublic: boolean; // Notun gerçek durumu dışarıdan gelmeli
  noteId: string;
}

export const NoteActions = ({ initialIsPublic, noteId }: NoteActionsProps) => {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const confirm = useConfirm(); 

  const handleAccessChange = async (checked: boolean) => {
    setIsUpdating(true);
    
    try {
      const ok = await confirm.confirm({
        title: "Erişimi Güncelle",
        description: `Bu notun erişimini ${checked ? "Public" : "Private"} olarak güncellemek üzeresiniz. Emin misiniz?`,
        confirmText: "Evet",
        variant: "destructive",
        size: "sm",
        icon: <ShieldCheck />,
        iconSize: "md",
        dontAskAgain: { id: "update-access-note", label: "Bu uyarıyı bir daha gösterme" }
      });

      if (ok) {
        // API isteği burada atılabilir: await api.updateNote(id, { isPublic: checked });
        setIsPublic(checked);
        console.log("Erişim güncellendi:", checked);
      } else {
        // Kullanıcı iptal ettiyse hiçbişey yapmıyoruz. 
        // isPublic değişmediği için Switch eski halinde kalır.
        console.log("Değişim iptal edildi.");
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
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-52 p-2 rounded-xl shadow-2xl border-border">
          <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-lg">
            <Eye className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Oku</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-lg">
            <Pencil className="h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Düzenle</span>
          </DropdownMenuItem>

          {/* ACCESS SWITCH ALANI */}
          <div 
            className="flex items-center justify-between px-2 py-2.5"
            // Dropdown'ın Switch'e tıklandığında kapanmasını engeller
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={isPublic ? "h-4 w-4 text-blue-500" : "h-4 w-4 opacity-70"} />
              <span className="font-medium text-sm">Access</span>
            </div>
            
            <Switch 
              checked={isPublic} 
              disabled={isUpdating}
              // onCheckedChange bize direkt yeni boolean değeri verir
              onCheckedChange={handleAccessChange}
              className="scale-75 origin-right"
            />
          </div>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            <span className="font-bold text-sm">Sil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};