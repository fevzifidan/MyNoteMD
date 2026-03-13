import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface SymbolCategoryPopoverProps {
  category: string;
  symbols: string[];
  onSelect: (latex: string) => void;
  groupBtnStyle: string; // BasicTab ile aynı stili korumak için
}

export const SymbolCategoryPopover = ({ 
  category, 
  symbols, 
  onSelect, 
  groupBtnStyle 
}: SymbolCategoryPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={groupBtnStyle}>
          <span className="text-xs font-medium whitespace-nowrap">{category}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-0 shadow-xl" align="start" sideOffset={8}>
        <div className="p-2 border-b bg-muted/30">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {category}
          </h4>
        </div>
        
        <ScrollArea className="h-60 p-2">
          <div className="grid grid-cols-4 gap-1">
            {symbols.map((latex, idx) => (
              <Button
                key={`${category}-${idx}`}
                variant="ghost"
                className="h-12 w-full p-0 hover:bg-accent hover:text-accent-foreground transition-all"
                onClick={() => onSelect(latex)}
                title={latex} // Hover yapınca latex kodunu ipucu olarak gösterir
              >
                <div className="scale-110">
                  <InlineMath math={latex} />
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};