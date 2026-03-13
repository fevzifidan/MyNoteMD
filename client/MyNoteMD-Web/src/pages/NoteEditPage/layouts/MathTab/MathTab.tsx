
import { SymbolCategoryPopover } from "./SymbolCategoryPopover";
import { MATH_SYMBOLS } from "./math-data";
import { useEditor } from "../Editor/EditorContext";

export default function MathTab() {
  const { insertMath } = useEditor();
  const groupContainer = "inline-flex items-center border border-input bg-background rounded-md shadow-sm overflow-hidden h-9 divide-x";
  const groupBtn = "h-full px-3 rounded-none bg-transparent hover:bg-accent hover:text-accent-foreground text-sm transition-colors shadow-none outline-none flex items-center gap-1.5";

  const handleSelect = (latex: string) => {
    insertMath(latex);
  };

  return (
    <div className="flex items-center">
      <div className={groupContainer}>
        {Object.entries(MATH_SYMBOLS).map(([category, symbols]) => (
          <SymbolCategoryPopover
            key={category}
            category={category}
            symbols={symbols}
            onSelect={handleSelect}
            groupBtnStyle={groupBtn}
          />
        ))}
      </div>
    </div>
  );
}