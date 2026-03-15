"use client";

import { useEffect, useState } from "react";
import apiService from "@/shared/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { CollectionRow } from "@/features/collections/components/collection-row";
import { NoteRow } from "@/features/notes/components/note-row";
import { ShowMoreButton } from "./show-more-button";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentActivity = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentData = async () => {
      setLoading(true);
      try {
        // İki isteği paralel olarak atıyoruz (Hız için)
        // API'den sadece 5 kayıt istiyoruz (pageSize=5)
        const [collectionsRes, notesRes] = await Promise.all([
          apiService.get("/collections", { params: { pageSize: 5 } }),
          apiService.get("/notes", { params: { pageSize: 5 } }),
        ]);

        setCollections(collectionsRes.items || []);
        setNotes(notesRes.items || []);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchRecentData();
  }, []);

  // Loading sırasında gösterilecek Skeleton yapısı
  const ListSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">

      {/* RECENT COLLECTIONS CARD */}
      <Card className="border-none shadow-none bg-transparent">
        <SectionHeader title="Recent Collections" />
        <CardContent className="px-0 space-y-1">
          {loading ? (
            <ListSkeleton />
          ) : (
            <>
              {collections.slice(0, 5).map((item) => (
                <CollectionRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  noteCount={item.noteCount}
                  createdAt={new Date(item.createdAt).toLocaleDateString()}
                />
              ))}
              {collections.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 px-2 italic">Henüz koleksiyon bulunmuyor.</p>
              )}
              {collections.length > 0 && <ShowMoreButton endpoint="/collections" />}
            </>
          )}
        </CardContent>
      </Card>

      {/* RECENT NOTES CARD */}
      <Card className="border-none shadow-none bg-transparent">
        <SectionHeader title="Recent Notes" />
        <CardContent className="px-0 space-y-1">
          {loading ? (
            <ListSkeleton />
          ) : (
            <>
              {notes.slice(0, 5).map((item) => (
                <NoteRow
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  status={item.isPublic ? "Public" : "Private"}
                  lastUpdated={new Date(item.updatedAt).toLocaleDateString()}
                />
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 px-2 italic">Henüz not bulunmuyor.</p>
              )}
              {notes.length > 0 && <ShowMoreButton endpoint="/notes" />}
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
};