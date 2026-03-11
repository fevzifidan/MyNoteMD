"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiService from "@/shared/services/api";
import { CollectionListItem } from "@/features/collections/components/collection-item";
import { NotePagination } from "@/features/notes/components/note-pagination";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // DashboardLayout içindeki GlobalSearch burayı tetikler

  // State Yönetimi
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Önceki sayfalara dönebilmek için cursor geçmişi
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const fetchCollections = useCallback(async (cursor: string | null, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      const response = await apiService.get("/collections", {
        params: { 
          cursor: cursor, 
          search: query 
        }
      });

      setCollections(response.items || []);
      setNextCursor(response.nextCursor || null);

      if (isNewSearch) {
        setCurrentPage(1);
        setCursorStack([null]);
      }
    } catch (error) {
      console.error("Collections fetch error:", error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Arama terimi (URL'deki ?q=) değiştiğinde listeyi sıfırla ve baştan getir
  useEffect(() => {
    fetchCollections(null, true);
  }, [query, fetchCollections]);

  // Sayfalama Fonksiyonları
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
        
        {/* Giriş Bilgisi (Opsiyonel - DashboardLayout'taki başlığın altına ek bilgi) */}
        {!query && collections.length > 0 && (
          <p className="text-muted-foreground text-lg mb-8 -mt-8 animate-in fade-in slide-in-from-top-2">
            Notlarınızı tematik klasörlerle organize edin.
          </p>
        )}

        {/* Loading / Content Bölümü */}
        {loading && collections.length === 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className={loading ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}>
            
            {/* Koleksiyon Listesi */}
            <div className="grid grid-cols-1 gap-4">
              {collections.map((item) => (
                <CollectionListItem key={item.id} collection={item} />
              ))}
            </div>

            {/* Boş Durum (Empty State) */}
            {!loading && collections.length === 0 && (
              <div className="text-center py-32 border-2 border-dashed rounded-[3rem] border-muted/40 bg-card/30">
                <p className="text-muted-foreground font-medium text-lg">
                  {query ? `"${query}" ile eşleşen koleksiyon bulunamadı.` : "Henüz bir koleksiyonunuz yok."}
                </p>
                {!query && (
                  <Button variant="link" className="mt-2 font-bold text-primary hover:no-underline text-lg">
                    Yeni bir tane oluşturun
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pagination - Sadece veri varsa göster */}
        {collections.length > 0 && (
          <div className="mt-12 mb-20">
            <NotePagination
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