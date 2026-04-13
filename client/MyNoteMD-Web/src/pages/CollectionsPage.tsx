"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { collectionService } from "@/shared/services/api";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { SharedPagination } from "@/shared/components/shared-pagination";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function CollectionsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // States
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Cursor history for returning to previous pages
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const fetchCollections = useCallback(async (cursor: string | null, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      const response = await collectionService.list({
        cursor: cursor,
        search: query
      });

      setCollections(response.items || []);
      setNextCursor(response.nextCursor || null);

      if (isNewSearch) {
        setCurrentPage(1);
        setCursorStack([null]);
      }
    } catch (error) {
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Reset the list and fetch from the beginning when the search term (URL's ?q=) changes
  useEffect(() => {
    fetchCollections(null, true);
  }, [query, fetchCollections]);

  // Pagination Functions
  const handleNext = () => {
    if (nextCursor) {
      setCursorStack((prev) => [...prev, nextCursor]);
      setCurrentPage((prev) => prev + 1);
      fetchCollections(nextCursor);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newStack = [...cursorStack];
      newStack.pop();
      const prevCursor = newStack[newStack.length - 1];

      setCursorStack(newStack);
      setCurrentPage((prev) => prev - 1);
      fetchCollections(prevCursor);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[400px]">

        {!query && collections.length > 0 && (
          <p className="text-muted-foreground text-lg mb-8 -mt-8 animate-in fade-in slide-in-from-top-2">
            {t("collectionPage:description")}
          </p>
        )}

        {/* Loading / Content Section */}
        {loading && collections.length === 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className={loading ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}>

            {/* Collection List */}
            <div className="grid grid-cols-1 gap-4">
              {collections.map((item) => (
                <CollectionCard key={item.id} collection={item} />
              ))}
            </div>

            {/* Empty State */}
            {!loading && collections.length === 0 && (
              <div className="text-center py-32 border-2 border-dashed rounded-[3rem] border-muted/40 bg-card/30">
                <p className="text-muted-foreground font-medium text-lg">
                  {query ? `"${query}" ile eşleşen koleksiyon bulunamadı.` : "Henüz bir koleksiyonunuz yok."}
                </p>
                {!query && (
                  <Button variant="link" className="mt-2 font-bold text-primary hover:no-underline text-lg">
                    {t("collectionPage:createCollection")}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pagination - Show only if there is data */}
        {collections.length > 0 && (
          <div className="mt-12 mb-0">
            <SharedPagination
              currentPage={currentPage}
              hasNextPage={!!nextCursor}
              onNext={handleNext}
              onPrevious={handlePrevious}
              disabled={loading}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}