import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      // Using a 2px threshold to avoid rounding issues
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    // Also observe the inner content since categories might be added dynamically
    const contentEl = el.firstElementChild;
    if (contentEl) resizeObserver.observe(contentEl);

    return () => resizeObserver.disconnect();
  }, [checkScroll, categories]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "right" ? 200 : -200, behavior: "smooth" });
  };

  return (
    <div className="relative group/tabs flex items-center min-w-0">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <div className="absolute left-0 z-10 h-full flex items-center pr-4 bg-gradient-to-r from-background via-background/80 to-transparent">
          <button
            onClick={() => scroll("left")}
            className="h-7 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-sm bg-background border border-input/50"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Category Tabs Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-1 overflow-x-auto scroll-smooth select-none px-0.5 hide-scrollbar"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        <div className="flex items-center gap-1 py-0.5">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                "inline-flex items-center justify-center px-3 h-7 text-[11px] font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer border",
                selected === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground border-transparent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <div className="absolute right-0 z-10 h-full flex items-center pl-4 bg-gradient-to-l from-background via-background/80 to-transparent">
          <button
            onClick={() => scroll("right")}
            className="h-7 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-sm bg-background border border-input/50"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
