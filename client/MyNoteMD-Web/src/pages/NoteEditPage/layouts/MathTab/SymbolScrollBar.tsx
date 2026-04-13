import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface SymbolScrollBarProps {
  symbols: string[];
  category: string;
  onSelect: (latex: string) => void;
}

export function SymbolScrollBar({ symbols, category, onSelect }: SymbolScrollBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    container.scrollLeft = 0;
    checkScroll();

    const resizeObserver = new ResizeObserver(() => checkScroll());
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    document.fonts?.ready.then(() => {
      checkScroll();
    });

    return () => resizeObserver.disconnect();
  }, [checkScroll, category, symbols]);

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({ left: direction === "right" ? 180 : -180, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center w-full border border-input rounded-md bg-background h-9 overflow-hidden group/symbol-bar">

      {canScrollLeft && (
        <div className="absolute left-0 z-10 h-full flex items-center pr-6 bg-gradient-to-r from-background via-background/90 to-transparent">
          <button
            onClick={() => scroll("left")}
            className="h-full px-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center border-r border-input/50"
            aria-label="Scroll symbols left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <TooltipProvider delayDuration={400}>
        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="p-1 flex-1 min-w-0 overflow-x-auto scroll-smooth hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div ref={contentRef} className="flex items-center gap-0.5 w-max">
            {symbols.map((latex, idx) => (
              <div key={`${category}-${idx}`} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 min-w-7 w-fit px-2 shrink-0 rounded hover:bg-accent transition-colors"
                      onClick={() => onSelect(latex)}
                    >
                      <span className="scale-[0.85] leading-none pointer-events-none select-none">
                        <InlineMath math={latex} />
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="bg-popover text-popover-foreground border shadow-md font-mono text-[10px]">
                    {latex}
                  </TooltipContent>
                </Tooltip>
                {idx < symbols.length - 1 && (
                  <div className="h-4 w-[1.5px] bg-foreground/25 shrink-0 mx-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {canScrollRight && (
        <div className="absolute right-0 z-10 h-full flex items-center pl-6 bg-gradient-to-l from-background via-background/90 to-transparent">
          <button
            onClick={() => scroll("right")}
            className="h-full px-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center border-l border-input"
            aria-label="Scroll symbols right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}