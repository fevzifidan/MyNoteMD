"use client";

import * as React from "react";
import {
  Home, Sparkles, FileText, Folder, Plus,
  HelpCircle, ChevronRight, ChevronLeft, Menu,
  Trash
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CreateCollectionDialog } from "@/features/collections/components/create-collection-dialog";
import { CreateNoteDialog } from "@/features/notes/components/create-not-dialog";

export function Sidebar() {
  const { t } = useTranslation("sidebar");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const sidebarRef = React.useRef<HTMLElement>(null);

  // To prevent hydration errors
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle outside clicks to close the sidebar
  React.useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      // Radix modalları ve portalları dış tıklama olarak sayma (Sidebar içi modalların kapanmasını vb. önler)
      if (
        target.closest('[role="dialog"]') ||
        target.closest('[role="alertdialog"]') ||
        target.closest('[data-radix-portal]')
      ) {
        return;
      }

      if (sidebarRef.current && !sidebarRef.current.contains(target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  if (!mounted) return null;

  return (
    <TooltipProvider delayDuration={0}>
      {/* 
        1. DESKTOP SIDEBAR (Floating Pill)
        - 'hidden': Not seen on mobile
        - 'min-[1060px]:flex': Visible on 1060px and above
      */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed left-6 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-in-out",
          "hidden min-[1060px]:flex flex-col items-center py-6", // Not seen on mobile
          "bg-card/80 backdrop-blur-lg border shadow-2xl rounded-[2.5rem]",
          isExpanded ? "w-64 px-4" : "w-20 px-2"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent z-50"
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </Button>

        <SidebarContent isExpanded={isExpanded} />
      </aside>

      {/* 
        2. MOBILE SIDEBAR (Hamburger & Sheet)
        - 'block': Seen on mobile
        - 'min-[1060px]:hidden': Not seen on 1060px and above
      */}
      <div className="min-[1060px]:hidden fixed top-6 left-6 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-xl bg-background/90 backdrop-blur-md border-primary/20 hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] border-r-0 rounded-r-[2.5rem] bg-card/95 backdrop-blur-xl p-6"
          >
            <SheetHeader className="text-left mb-8">
              <SheetTitle className="text-3xl font-bold italic tracking-tighter text-primary">
                {t("sidebar:menu")}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pr-2">
              <SidebarContent isExpanded={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

// --- SHARED MENU CONTENT ---
function SidebarContent({ isExpanded }: { isExpanded: boolean }) {
  const { t } = useTranslation("sidebar");
  const [isNewOpen, setIsNewOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isExpanded) {
      setIsNewOpen(false);
    }
  }, [isExpanded]);

  return (
    <div className="flex flex-col w-full gap-2">
      <SidebarItem icon={Home} label={t("sidebar:home")} isExpanded={isExpanded} endpoint="/home" />

      <SidebarItem icon={Sparkles} label={t("sidebar:ai")} isExpanded={isExpanded} endpoint="/ai" />

      {/* Gradient Separator under AI */}
      <div className="px-4 py-2">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <SidebarItem icon={FileText} label={t("sidebar:myNotes")} isExpanded={isExpanded} endpoint="/notes" />
      <SidebarItem icon={Folder} label={t("sidebar:myCollections")} isExpanded={isExpanded} endpoint="/collections" />
      <SidebarItem icon={Trash} label={t("sidebar:trash")} isExpanded={isExpanded} endpoint="/trash" />

      {/* 'New' Option (Collapsible) */}
      <Collapsible open={isNewOpen} onOpenChange={setIsNewOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <SidebarItem
            icon={Plus}
            label={t("sidebar:new")}
            isExpanded={isExpanded}
            rightElement={
              <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isNewOpen && "rotate-90")} />
            }
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-1 animate-in fade-in slide-in-from-top-1">
          <CreateCollectionDialog isExpanded={isExpanded} />
          <CreateNoteDialog isExpanded={isExpanded} />
        </CollapsibleContent>
      </Collapsible>

      {/* Normal Separator under New */}
      <div className="px-4 py-2">
        <Separator className="opacity-40" />
      </div>

      <SidebarItem icon={HelpCircle} label={t("sidebar:help")} isExpanded={isExpanded} endpoint="/help" />
    </div>
  );
}

// --- SIDEBAR ITEM COMPONENT ---
const SidebarItem = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  const { icon: Icon, label, isExpanded, endpoint, onClick, rightElement, className, ...rest } = props;
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (endpoint) navigate(endpoint);
    if (onClick) onClick(e);
  };

  const button = (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "w-full flex items-center gap-4 px-3 h-12 rounded-2xl transition-all group",
        isExpanded ? "justify-start" : "justify-center",
        className
      )}
      onClick={handleClick}
      {...rest}
    >
      <Icon className="h-5 w-5 shrink-0 group-hover:text-primary transition-colors" />
      {isExpanded && (
        <span className={cn("font-semibold tracking-tight", rightElement && "flex-1 text-left")}>
          {label}
        </span>
      )}
      {isExpanded && rightElement}
    </Button>
  );

  // If expanded, just return the button without Tooltip wrapper.
  if (isExpanded) {
    return button;
  }

  // If collapsed, wrap with Tooltip
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {button}
      </TooltipTrigger>
      <TooltipContent side="right" className="font-bold">{label}</TooltipContent>
    </Tooltip>
  );
});
SidebarItem.displayName = "SidebarItem";