import { FileText, Globe, Lock } from "lucide-react";
import { NoteActions } from "./note-actions";
import { useNavigate } from "react-router-dom"; // Yönlendirme için

interface NoteItemProps {
  id: string; // Tıklama için ID ekledik
  title: string;
  status: "Public" | "Private";
  lastUpdated: string;
}

export const NoteItem = ({ id, title, status, lastUpdated }: NoteItemProps) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    // Notun detay sayfasına yönlendirir
    navigate(`/notes/${id}`);
  };

  return (
    <div 
      onClick={handleItemClick}
      className="group flex items-center justify-between p-3 rounded-xl transition-all hover:bg-accent/50 active:scale-[0.98] cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Sol İkon Konteynırı */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <FileText className="h-5 w-5" />
        </div>

        {/* Metin Bilgileri */}
        <div className="space-y-1">
          <p className="text-sm text-left font-semibold leading-none tracking-tight">{title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium opacity-80">
            {/* Status İkonları (Opsiyonel ama şık durur) */}
            <span className="flex items-center gap-1">
              {status === "Public" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {status}
            </span>
            <span>•</span>
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pr-2">
        {/* Aksiyon Butonu - Propagation burada NoteActions içinde yönetilmeli */}
        <div onClick={(e) => e.stopPropagation()}>
           <NoteActions initialIsPublic={status === "Public"} noteId={id} />
        </div>

        {/* Resimdeki dekoratif sağ nokta */}
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20 group-hover:bg-muted-foreground/40 transition-colors mr-2" />
      </div>
    </div>
  );
};