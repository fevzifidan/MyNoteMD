"use client";

import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const CollectionSearchBar = ({ onSearch }: { onSearch: (val: string, type: string) => void }) => {
  const [type, setType] = useState<"Collections" | "Notes">("Collections");

  return (
    <div className="relative flex items-center w-full max-w-2xl mx-auto h-14 rounded-full border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full rounded-none border-r px-6 gap-2 font-bold hover:bg-muted transition-colors">
            {type === "Collections" ? "Koleksiyonlar" : "Notlar"}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 mt-2">
          <DropdownMenuItem onClick={() => setType("Collections")} className="justify-between font-medium">
            Koleksiyonlar {type === "Collections" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setType("Notes")} className="justify-between font-medium">
            Notlar {type === "Notes" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        placeholder="Aramaya başlayın..."
        className="flex-1 border-none shadow-none focus-visible:ring-0 h-full text-lg bg-transparent px-6"
        onChange={(e) => onSearch(e.target.value, type)}
      />

      <div className="pr-6 text-muted-foreground">
        <Search className="h-6 w-6" />
      </div>
    </div>
  );
};