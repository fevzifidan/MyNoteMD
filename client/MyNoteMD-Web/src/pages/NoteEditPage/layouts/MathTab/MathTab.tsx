import { useState } from "react";
import { MATH_SYMBOLS } from "./math-data";
import { useEditor } from "../Editor/EditorContext";
import { CategoryTabs } from "./CategoryTabs";
import { SymbolScrollBar } from "./SymbolScrollBar";

const CATEGORIES = Object.keys(MATH_SYMBOLS) as (keyof typeof MATH_SYMBOLS)[];

export default function MathTab() {
  const { insertMath } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof MATH_SYMBOLS>(CATEGORIES[0]);

  const handleSelect = (latex: string) => {
    insertMath(latex);
  };

  const symbols = MATH_SYMBOLS[selectedCategory];

  return (
    <div className="flex flex-col gap-1 min-w-0 flex-1">
      {/* Row 1: Category selector tabs */}
      <CategoryTabs
        categories={CATEGORIES as string[]}
        selected={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat as keyof typeof MATH_SYMBOLS)}
      />

      {/* Row 2: Symbol scroll bar for selected category */}
      <SymbolScrollBar
        symbols={symbols}
        category={selectedCategory}
        onSelect={handleSelect}
      />
    </div>
  );
}