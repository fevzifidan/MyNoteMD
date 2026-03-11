import { Folder, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CollectionActions } from "./collection-actions";

export const CollectionItem = ({ id, name, noteCount, createdAt }: any) => {
  const navigate = useNavigate();

  const handleItemClick = async (e: React.MouseEvent):Promise<void> => {
    navigate(`/collection/notes?collectionId=${id}`);
  }

  return (
    <div
      onClick={handleItemClick}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 group active:scale-[0.98] cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* İkon Alanı */}
        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <Folder className="h-5 w-5" />
        </div>

        {/* Metin Alanı (Dikey Dizilim) */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none mb-1">
            {name} 
            <span className="text-muted-foreground/50 ml-1 font-normal">
              ({noteCount} notes)
            </span>
          </span>
          <span className="text-xs text-muted-foreground text-left font-medium opacity-70">
            Created at: {createdAt}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 pr-2">
        <CollectionActions collectionId={id}/>
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20 group-hover:bg-muted-foreground/40 transition-colors mr-2" />
      </div>
    </div>
  );
};