import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BasicTab from "./BasicTab";

export default function CommandPalette() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center bg-card text-card-foreground border shadow-xl rounded-3xl p-3 w-max max-w-[95vw]">
      
      {/* Üst Kısım: Radio Buttons (Ortalanmış) */}
      <RadioGroup
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex justify-center space-x-6 mb-3 w-full"
      >
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="basic" id="r1" />
          <Label htmlFor="r1" className="cursor-pointer">Basic</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="math" id="r2" />
          <Label htmlFor="r2" className="cursor-pointer">Math</Label>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <RadioGroupItem value="diagram" id="r3" />
          <Label htmlFor="r3" className="cursor-pointer">Diagram</Label>
        </div>
      </RadioGroup>

      {/* Alt Kısım: Araç Çubuğu (Yatay Scrollable) */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max pb-1">
          
          {/* Basic Sekmesi İçeriği */}
          {activeTab === "basic" && (
            <BasicTab />
          )}

          {activeTab === "math" && <div className="p-2 text-sm text-muted-foreground w-full text-center">Math araçları buraya gelecek...</div>}
          {activeTab === "diagram" && <div className="p-2 text-sm text-muted-foreground w-full text-center">Diagram araçları buraya gelecek...</div>}
        </div>
      </div>
    </div>
  );
}