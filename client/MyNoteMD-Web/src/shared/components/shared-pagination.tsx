import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SharedPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onNext: () => void;
  onPrevious: () => void;
  disabled?: boolean;
}

export const SharedPagination = ({ currentPage, hasNextPage, onNext, onPrevious, disabled }: SharedPaginationProps) => {
  const { t } = useTranslation();
  return (
    <Pagination className="mt-5">
      <PaginationContent className="gap-4">
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={currentPage === 1 || disabled}
            className="gap-1 pl-2.5 rounded-full"
          >
            <PaginationPrevious className="hover:bg-transparent p-0" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <div className="flex h-10 w-24 items-center justify-center rounded-full bg-secondary/50 text-sm font-bold shadow-inner">
            {t("common:info.page")} {currentPage}
          </div>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={!hasNextPage || disabled}
            className="gap-1 pr-2.5 rounded-full"
          >
            <PaginationNext className="hover:bg-transparent p-0" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
