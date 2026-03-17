// features/notes/hooks/useNotePagination.ts
import { useState } from "react";

export const useNotePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]); // First page cursor is null

  const handleNextPage = (nextCursor: string) => {
    setCursorStack((prev) => [...prev, nextCursor]);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCursorStack((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage,
    currentCursor: cursorStack[cursorStack.length - 1],
    handleNextPage,
    handlePreviousPage,
    hasPrevious: currentPage > 1,
  };
};