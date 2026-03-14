"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import apiService from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";

// Combobox'ın tam olarak beklediği tip (senin ülkeler örneğindeki yapı)
type ComboboxOption = {
  code: string;  // Backend'deki ID'yi (Guid) burada tutacağız
  value: string; // Arama (search) işleminin yapılacağı alan (küçük harf isim)
  label: string; // Ekranda kullanıcıya gösterilecek alan (orijinal isim)
};

const defaultOption: ComboboxOption = { code: "", value: "", label: "Select a collection" };

export function CreateNoteDialog({ isExpanded }: { isExpanded: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCollections, setFetchingCollections] = useState(false);

  const [title, setTitle] = useState("");
  const [collections, setCollections] = useState<ComboboxOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<ComboboxOption>(defaultOption);

  useEffect(() => {
    if (open) {
      const fetchCollections = async () => {
        setFetchingCollections(true);
        try {
          const response = await apiService.get("/collections/lookup");
          const dataArray = Array.isArray(response) ? response : (response.data || []);

          // VERİ DÖNÜŞÜMÜ (MAPPING) DÜZELTİLDİ
          const formattedData = dataArray.map((item: any) => {
            const itemName = item.Name || item.name || "";
            const itemId = item.Id || item.id || "";

            return {
              code: itemId,                    // API'ye göndereceğimiz ID (Örn: 3fa85f64...)
              value: itemName.toLowerCase(),   // Search bar'ın filtreleme yapacağı değer
              label: itemName                  // Listede görünecek isim
            };
          });

          setCollections([defaultOption, ...formattedData]);
        } catch (error) {

        } finally {
          setFetchingCollections(false);
        }
      };
      fetchCollections();
    } else {
      // Dialog kapandığında formu sıfırla
      setTitle("");
      setSelectedCollection(defaultOption);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // selectedCollection.code artık bizim backend'in beklediği GUID değeridir!
    if (!title.trim() || !selectedCollection.code) {
      notificationService.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await apiService.post("/notes", {
        title: title,
        collectionId: selectedCollection.code // .value yerine .code gönderiyoruz
      });
      notificationService.success("Note created successfully!");
      setOpen(false);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-4 h-10 rounded-xl pl-10 text-muted-foreground hover:text-foreground",
            !isExpanded && "hidden"
          )}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium flex-1 text-left">Not</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>Add a new note to a collection.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Note Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Collection</Label>
              <Combobox
                items={collections}
                value={selectedCollection}
                onValueChange={setSelectedCollection}
                disabled={fetchingCollections}
              >
                <ComboboxTrigger
                  render={
                    <Button variant="outline" className="w-full justify-between font-normal">
                      <ComboboxValue />
                    </Button>
                  }
                />
                {/* z-index eklendi: Dialog overlay'inin altında kalıp tıklanmayı engellememesi için */}
                <ComboboxContent className="z-[9999]">
                  <ComboboxInput showTrigger={false} placeholder="Search collections..." />
                  <ComboboxEmpty>No collections found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.code} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={!title.trim() || !selectedCollection.code || loading}>
              {loading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}