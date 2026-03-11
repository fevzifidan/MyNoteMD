"use client";

import * as React from "react";
import { 
  Home, Sparkles, FileText, Folder, Plus, 
  HelpCircle, ChevronRight, ChevronLeft, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Hydration hatasını önlemek için
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <TooltipProvider delayDuration={0}>
      {/* 
        1. MASAÜSTÜ SIDEBAR (Floating Pill)
        - 'hidden': Mobilde tamamen gizle
        - 'md:flex': 768px ve üzerinde görünür yap
      */}
      <aside
        className={cn(
          "fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-in-out",
          "hidden md:flex flex-col items-center py-6", // MOBİLDE HİÇ YOK
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
        2. MOBİL SIDEBAR (Hamburger & Sheet)
        - 'block': Mobilde görünür
        - 'md:hidden': 768px ve üzerinde tamamen gizle
      */}
      <div className="md:hidden fixed top-6 left-6 z-[60]">
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
                Menu
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

// --- ORTAK MENÜ İÇERİĞİ ---
function SidebarContent({ isExpanded }: { isExpanded: boolean }) {
  const [isYeniOpen, setIsYeniOpen] = React.useState(false);

  return (
    <div className="flex flex-col w-full gap-2">
      <SidebarItem icon={Home} label="Home" isExpanded={isExpanded} endpoint="/home" />
      
      <SidebarItem icon={Sparkles} label="AI" isExpanded={isExpanded} endpoint="/ai" />
      
      {/* AI Altındaki Gradyan Ayırıcı */}
      <div className="px-4 py-2">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <SidebarItem icon={FileText} label="Notlarım" isExpanded={isExpanded} endpoint="/notes" />
      <SidebarItem icon={Folder} label="Koleksiyonlarım" isExpanded={isExpanded} endpoint="/collections" />

      {/* Yeni Seçeneği (Collapsible) */}
      <Collapsible open={isYeniOpen} onOpenChange={setIsYeniOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-4 px-3 h-12 rounded-2xl transition-all",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            <Plus className="h-5 w-5 shrink-0" />
            {isExpanded && <span className="font-semibold flex-1 text-left">Yeni</span>}
            {isExpanded && (
              <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isYeniOpen && "rotate-90")} />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 mt-1 animate-in fade-in slide-in-from-top-1">
          <Button variant="ghost" className={cn("w-full flex items-center gap-4 h-10 rounded-xl pl-10 text-muted-foreground hover:text-foreground", !isExpanded && "hidden")}>
            <Folder className="h-4 w-4" /> <span className="text-sm font-medium">Koleksiyon</span>
          </Button>
          <Button variant="ghost" className={cn("w-full flex items-center gap-4 h-10 rounded-xl pl-10 text-muted-foreground hover:text-foreground", !isExpanded && "hidden")}>
            <FileText className="h-4 w-4" /> <span className="text-sm font-medium">Not</span>
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* Yeni Altındaki Normal Ayırıcı */}
      <div className="px-4 py-2">
        <Separator className="opacity-40" />
      </div>

      <SidebarItem icon={HelpCircle} label="Help" isExpanded={isExpanded} endpoint="/help" />
    </div>
  );
}

// --- SIDEBAR LİNK BİLEŞENİ ---
function SidebarItem({ icon: Icon, label, isExpanded, endpoint }: any) {
  const navigate = useNavigate();

  return (
    <Tooltip disabled={isExpanded}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-4 px-3 h-12 rounded-2xl transition-all group",
            isExpanded ? "justify-start" : "justify-center"
          )}
          onClick={() => navigate(endpoint)}
        >
          <Icon className="h-5 w-5 shrink-0 group-hover:text-primary transition-colors" />
          {isExpanded && <span className="font-semibold tracking-tight">{label}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-bold">{label}</TooltipContent>
    </Tooltip>
  );
}