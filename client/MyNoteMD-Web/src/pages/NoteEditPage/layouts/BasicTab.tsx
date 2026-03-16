import { useState } from "react";
import { ChevronDown, Bold, Italic, Underline, Strikethrough, ListOrdered, List, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "./Editor/EditorContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function BasicTab() {
    const { applyFormat, clearFormat, insertText } = useEditor();
    const { t } = useTranslation('noteEditPage');
    const [textColor, setTextColor] = useState("#ef4444"); // Varsayılan kırmızı
    const [highlightColor, setHighlightColor] = useState("#eab308"); // Varsayılan sarı

    // Örnek hızlı renk paleti
    const colors = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#000000"];

    // Buton grupları için ortak stil (Bitişik görünüm)
    // Dış çerçeve, arka plan ve gölge konteynerda
    const groupContainer = "inline-flex items-center border border-input bg-background rounded-md shadow-sm overflow-hidden h-9 divide-x";
    
    // Butonlar ghost tarzında, sadece aralarında border-r var
    const groupBtn = "h-full px-3 rounded-none bg-transparent hover:bg-accent hover:text-accent-foreground text-sm transition-colors shadow-none outline-none";

    return (
        <>
              {/* Heading Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-16 flex justify-between px-2">
                    H <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <DropdownMenuItem key={level}>H{level}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* B, I, U, S Toggle Group */}
              <ToggleGroup type="multiple" className={groupContainer}>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat("**", "**")}><Bold/></Button>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat("*", "*")}><Italic/></Button>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat("<u>", "</u>")}><Underline/></Button>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat("~~", "~~")}><Strikethrough/></Button>
              </ToggleGroup>

              {/* Text Color Picker (Split Button & Custom Hex) */}
              <div className="flex items-center border rounded-md h-10 bg-background">
                <button 
                  className="px-3 hover:bg-accent h-full rounded-l-md flex items-center justify-center transition-colors"
                  onClick={() => applyFormat(`:style[`, `]{color=${textColor}}`, true)}
                >
                  <Palette className="w-5 h-5" style={{ color: textColor }} />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-1 border-l h-full hover:bg-accent rounded-r-md transition-colors">
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 flex flex-col gap-3">
                    <div className="flex gap-1">
                      {colors.map((c) => (
                        <button
                          key={c}
                          className="w-6 h-6 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                          onClick={() => setTextColor(c)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="text-hex" className="text-xs text-muted-foreground w-8">{t('basicTab.hex')}</Label>
                      <Input 
                        id="text-hex"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-7 text-xs px-2 uppercase"
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Highlight Color Picker (Split Button & Custom Hex) */}
              <div className="flex items-center border rounded-md h-10 bg-background">
                <button 
                  className="px-3 hover:bg-accent h-full rounded-l-md flex items-center justify-center transition-colors"
                  onClick={() => applyFormat(`:style[`, `]{bg=${highlightColor}}`, true)}
                >
                  <div className="w-5 h-2 border border-border" style={{ backgroundColor: highlightColor }} />
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="px-1 border-l h-full hover:bg-accent rounded-r-md transition-colors">
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 flex flex-col gap-3">
                    <div className="flex gap-1">
                      {colors.map((c) => (
                        <button
                          key={c}
                          className="w-6 h-6 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                          onClick={() => setHighlightColor(c)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="highlight-hex" className="text-xs text-muted-foreground w-8">{t('basicTab.hex')}</Label>
                      <Input 
                        id="highlight-hex"
                        value={highlightColor}
                        onChange={(e) => setHighlightColor(e.target.value)}
                        className="h-7 text-xs px-2 uppercase"
                        placeholder="#FFFF00"
                        maxLength={7}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Font Size */}
              <ToggleGroup type="single" className={groupContainer}>
                <Button variant={"outline"} className={groupBtn}>F+</Button>
                <Button variant={"outline"} className={groupBtn}>F-</Button>
              </ToggleGroup>

              {/* Alignment Toggle Group */}
              <ToggleGroup type="single" className={groupContainer}>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat(`:style[`, `]{align=left}`, true)}><AlignLeft/></Button>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat(`:style[`, `]{align=center}`, true)}><AlignCenter/></Button>
                <Button variant={"outline"} className={groupBtn} onClick={() => applyFormat(`:style[`, `]{align=right}`, true)}><AlignRight/></Button>
              </ToggleGroup>

              {/* List Toggle Group */}
              <ToggleGroup type="single" className={groupContainer}>
                <Button variant={"outline"} className={groupBtn}><ListOrdered/></Button>
                <Button variant={"outline"} className={groupBtn}><List/></Button>
              </ToggleGroup>

              {/* FN Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1 px-3">
                    FN <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>{t('basicTab.fn.indicator')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('basicTab.fn.descriptor')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Insert Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-1 px-3">
                  {t('basicTab.insert.label')} <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => insertText("[title](url)")}>{t('basicTab.insert.link')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertText("![alt](url)")}>{t('basicTab.insert.imageLink')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => applyFormat("```\n", "\n```")}>{t('basicTab.insert.code')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => insertText("\n| header | header |\n| --- | --- |\n| cell | cell |\n")}>{t('basicTab.insert.table')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={clearFormat} className="text-xs">{t('basicTab.clear')}</Button>
            </>
    )
}