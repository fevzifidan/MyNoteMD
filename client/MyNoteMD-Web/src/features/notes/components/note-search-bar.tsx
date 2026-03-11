"use client";

import { useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const NoteSearchBar = ({ onSearch }: { onSearch: (val: string, type: string) => void }) => {
  const [searchType, setSearchType] = useState<"Collections" | "Notes">("Notes");

  return (
    <div className="relative flex items-center w-full max-w-2xl mx-auto h-12 rounded-full border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
      {/* Sol taraf: Seçim Menüsü */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-full rounded-none border-r px-4 gap-2 text-sm font-medium hover:bg-muted">
            {searchType === "Notes" ? "Notlar" : "Koleksiyonlar"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={() => setSearchType("Notes")} className="justify-between">
            Notlar {searchType === "Notes" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSearchType("Collections")} className="justify-between">
            Koleksiyonlar {searchType === "Collections" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Orta taraf: Input */}
      <Input
        placeholder={`${searchType === "Notes" ? "Notlarda" : "Koleksiyonlarda"} ara...`}
        className="flex-1 border-none shadow-none focus-visible:ring-0 h-full text-base bg-transparent px-4"
        onChange={(e) => onSearch(e.target.value, searchType)}
      />

      {/* Sağ taraf: İkon */}
      <div className="pr-4 text-muted-foreground">
        <Search className="h-5 w-5" />
      </div>
    </div>
  );
};