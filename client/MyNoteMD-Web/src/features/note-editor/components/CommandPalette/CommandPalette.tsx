import { useState, useId, useRef, useEffect, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BasicTab from "../Tabs/BasicTab";
import MathTab from "../Tabs/MathTab/MathTab";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CommandPalette({ className, forceVertical = false }: { className?: string; forceVertical?: boolean }) {
  const [activeTab, setActiveTab] = useState("basic");
  const { t } = useTranslation('noteEditPage');
  
  const idPrefix = useId();
  const basicId = `${idPrefix}-basic`;
  const mathId = `${idPrefix}-math`;
  const diagramId = `${idPrefix}-diagram`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (forceVertical) return;
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  }, [forceVertical]);

  useEffect(() => {
    if (forceVertical) return;
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    const contentEl = el.firstElementChild;
    if (contentEl) resizeObserver.observe(contentEl);

    return () => resizeObserver.disconnect();
  }, [checkScroll, forceVertical, activeTab]);

  const handleScroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "right" ? 150 : -150, behavior: "smooth" });
  };

  return (
    <div className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center bg-card text-card-foreground border shadow-xl rounded-3xl p-3 w-max max-w-[75vw] max-[1060px]:top-24 transition-all duration-300", className)}>

      {/* Top Section: Radio Buttons (Centered) */}
      <RadioGroup
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex justify-center space-x-6 mb-3 w-full"
      >
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="basic" id={basicId} />
          <Label htmlFor={basicId} className="cursor-pointer">{t('commandPalette.tabs.basic')}</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="math" id={mathId} />
          <Label htmlFor={mathId} className="cursor-pointer">{t('commandPalette.tabs.math')}</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="diagram" id={diagramId} />
          <Label htmlFor={diagramId} className="cursor-pointer">{t('commandPalette.tabs.diagram')}</Label>
        </div>
      </RadioGroup>

      {/* Bottom Section: Tool Bar (Horizontally Scrollable / Wrapped) */}
      <div className="relative w-full flex items-center min-w-0 px-1">
        {/* Scroll Left Button */}
        {!forceVertical && canScrollLeft && (
          <div className="absolute left-0 z-10 h-full flex items-center pr-4 bg-gradient-to-r from-card via-card/85 to-transparent">
            <button
              onClick={() => handleScroll("left")}
              className="h-7 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-sm bg-card border border-input/50 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Scrollable / Wrapped Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className={cn(
            "w-full px-0.5",
            !forceVertical && "overflow-x-auto hide-scrollbar scroll-smooth"
          )}
          style={!forceVertical ? {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          } : undefined}
        >
          <div className={cn(
            "flex items-center gap-2 pb-1",
            forceVertical 
              ? "flex-wrap justify-center w-full" 
              : (activeTab === "math" ? "w-full" : "min-w-max justify-start")
          )}>
            {/* Basic Tab Content */}
            {activeTab === "basic" && (
              <BasicTab />
            )}

            {/* Math Tab Content */}
            {activeTab === "math" && <MathTab forceVertical={forceVertical} />}
            
            {/* Diagram Tab Content */}
            {activeTab === "diagram" && (
              <div className="p-2 text-sm text-muted-foreground w-full text-center">
                {t('commandPalette.tabs.diagramPlaceholder')}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Right Button */}
        {!forceVertical && canScrollRight && (
          <div className="absolute right-0 z-10 h-full flex items-center pl-4 bg-gradient-to-l from-card via-card/85 to-transparent">
            <button
              onClick={() => handleScroll("right")}
              className="h-7 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all shadow-sm bg-card border border-input/50 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
