import * as React from "react";
import { Menu, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar, SidebarContent } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { QuickSettingsNav } from "./quick-settings-nav";
import { CommandPalette } from "@/features/note-editor";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

export function NoteEditNavbar() {
  const { t } = useTranslation(["sidebar", "noteEditPage"]);

  return (
    <>
      {/* --- DESKTOP VIEW (>= 1060px) --- */}
      {/* Floating Sidebar (hides automatically on mobile via CSS inside it) */}
      <Sidebar hideMobileTrigger={true} />

      {/* Top Header for Desktop */}
      <header className="hidden min-[1060px]:block sticky top-0 z-30 w-full pointer-events-none">
        <div className="relative w-full flex flex-col items-center pt-6 pb-4">
          <QuickSettingsNav 
            collapse={true} 
            className="absolute top-6 right-6 pointer-events-auto" 
          />
          <CommandPalette 
            className="static translate-x-0 left-auto top-0 pointer-events-auto" 
          />
        </div>
      </header>

      {/* --- MOBILE VIEW (< 1060px) --- */}
      <header className="min-[1060px]:hidden sticky top-0 z-30 w-full bg-background/90 backdrop-blur-md border-b border-border/45 px-6 py-2 flex items-center justify-between">
        
        {/* Left Side: Sidebar Menu Sheet */}
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 shadow-lg bg-background/90 backdrop-blur-md border-primary/20 hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[320px] border-r-0 rounded-r-[2.5rem] bg-card/95 backdrop-blur-xl p-6 flex flex-col h-full"
            >
              <SheetHeader className="text-left mb-4">
                <SheetTitle className="text-3xl font-bold italic tracking-tighter text-primary">
                  {t("sidebar:menu")}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Quick Settings Section (Profile, Language, Theme) */}
                <div className="bg-muted/30 p-3 rounded-2xl border border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    {t("sidebar:settings", { defaultValue: "Settings" })}
                  </p>
                  <div className="flex items-center gap-3">
                    <QuickSettingsNav 
                      collapse={false} 
                      className="static top-auto right-auto z-auto flex items-center gap-3 animate-none" 
                    />
                  </div>
                </div>

                <Separator className="opacity-45" />

                {/* Navigation Links */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    {t("sidebar:navigation", { defaultValue: "Navigation" })}
                  </p>
                  <SidebarContent isExpanded={true} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right Side: On-Demand Editor Tools Modal */}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 shadow-lg bg-background/90 backdrop-blur-md border-primary/20 hover:bg-accent"
              >
                <PenTool className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[96vw] max-w-[620px] rounded-[2rem] p-6 bg-card/95 backdrop-blur-xl border-2 border-primary/10 shadow-2xl overflow-hidden">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-primary" />
                  {t("noteEditPage:commandPalette.title", { defaultValue: "Editor Tools" })}
                </DialogTitle>
              </DialogHeader>
              <div className="w-full overflow-x-auto">
                <CommandPalette 
                  forceVertical={true}
                  className="static translate-x-0 left-auto top-auto z-auto w-full border-0 shadow-none bg-transparent p-0" 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </>
  );
}
