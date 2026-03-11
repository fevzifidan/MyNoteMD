"use client";

import * as React from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface GlobalSearchProps {
  onSearch: (value: string) => void;
  onTypeChange: (type: "Collections" | "Notes") => void;
  currentType: "Collections" | "Notes";
  defaultValue?: string;
  placeholder?: string;
}

export function GlobalSearch({ onSearch, onTypeChange, currentType, defaultValue, placeholder }: GlobalSearchProps) {
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto">
      <div className="relative flex items-center w-full h-12 bg-background border rounded-full px-1 shadow-sm focus-within:ring-2 focus-within:ring-[#3D5278] transition-all overflow-hidden">
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10 px-4 ml-1 rounded-full text-muted-foreground hover:bg-transparent shrink-0">
              <span className="text-sm font-semibold">{currentType === "Notes" ? "Notlar" : "Koleksiyonlar"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl mt-2">
            <DropdownMenuItem onClick={() => onTypeChange("Collections")}>Koleksiyonlar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTypeChange("Notes")}>Notlar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1 opacity-50" />

        <Input
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue} // URL'den gelen değer
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-base h-full"
        />
        <div className="pr-4 pl-2 text-muted-foreground/60">
          <Search className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}