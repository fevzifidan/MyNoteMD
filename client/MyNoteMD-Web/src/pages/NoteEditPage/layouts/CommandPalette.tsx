import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BasicTab from "./BasicTab";
import MathTab from "./MathTab/MathTab";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";


export default function CommandPalette({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("basic");
  const { t } = useTranslation('noteEditPage');

  return (
    <div className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center bg-card text-card-foreground border shadow-xl rounded-3xl p-3 w-max max-w-[75vw] max-[1060px]:top-24 transition-all duration-300", className)}>

      {/* Top Section: Radio Buttons (Centered) */}
      <RadioGroup
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex justify-center space-x-6 mb-3 w-full"
      >
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="basic" id="r1" />
          <Label htmlFor="r1" className="cursor-pointer">{t('commandPalette.tabs.basic')}</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="math" id="r2" />
          <Label htmlFor="r2" className="cursor-pointer">{t('commandPalette.tabs.math')}</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="diagram" id="r3" />
          <Label htmlFor="r3" className="cursor-pointer">{t('commandPalette.tabs.diagram')}</Label>
        </div>
      </RadioGroup>

      {/* Bottom Section: Tool Bar (Horizontally Scrollable) */}
      <div className="w-full overflow-x-auto hide-scrollbar px-1">
        <div className={cn(
          "flex items-center gap-2 pb-1",
          activeTab === "math" ? "w-full" : "min-w-max"
        )}>


          {/* Basic Tab Content */}
          {activeTab === "basic" && (
            <BasicTab />
          )}

          {activeTab === "math" && <MathTab />}
          {activeTab === "diagram" && <div className="p-2 text-sm text-muted-foreground w-full text-center">{t('commandPalette.tabs.diagramPlaceholder')}</div>}
        </div>
      </div>
    </div>
  );
}