"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { noteService, collectionService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

// Type for Combobox
type ComboboxOption = {
  code: string;  // ID
  value: string; // Search
  label: string; // Display
};

const defaultOption: ComboboxOption = { code: "", value: "", label: t("createNoteDialog:collection") };

export function CreateNoteDialog({ isExpanded }: { isExpanded: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCollections, setFetchingCollections] = useState(false);

  const [title, setTitle] = useState("");
  const [collections, setCollections] = useState<ComboboxOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<ComboboxOption>(defaultOption);

  const { t } = useTranslation(["createNoteDialog", "common"]);

  useEffect(() => {
    if (open) {
      const fetchCollections = async () => {
        setFetchingCollections(true);
        try {
          const response = await collectionService.lookup();
          const dataArray = Array.isArray(response) ? response : (response.data || []);

          const formattedData = dataArray.map((item: any) => {
            const itemName = item.Name || item.name || "";
            const itemId = item.Id || item.id || "";

            return {
              code: itemId,                    // Id to send to API
              value: itemName.toLowerCase(),   // Value for search bar to filter
              label: itemName                  // Label to display
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
      // Reset the form when the dialog closes
      setTitle("");
      setSelectedCollection(defaultOption);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !selectedCollection.code) {
      notificationService.error(t("common:error.fill_all_fields"));
      return;
    }

    setLoading(true);
    try {
      await noteService.create({
        title: title,
        collectionId: selectedCollection.code
      });
      notificationService.success(t("createNoteDialog:success"));
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
          <span className="text-sm font-medium flex-1 text-left">{t("createNoteDialog:note")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("createNoteDialog:title")}</DialogTitle>
            <DialogDescription>{t("createNoteDialog:description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t("createNoteDialog:title")}</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>{t("createNoteDialog:collection")}</Label>
              <Combobox
                items={collections}
                value={selectedCollection}
                onValueChange={(value) => setSelectedCollection(value ?? defaultOption)}
                disabled={fetchingCollections}
              >
                <ComboboxTrigger
                  render={
                    <Button variant="outline" className="w-full justify-between font-normal">
                      <ComboboxValue />
                    </Button>
                  }
                />
                {/* z-index added: To prevent it from staying under the dialog overlay and blocking clicks */}
                <ComboboxContent className="z-[9999]">
                  <ComboboxInput showTrigger={false} placeholder={t("createNoteDialog:searchPlaceholder")} />
                  <ComboboxEmpty>{t("createNoteDialog:noCollectionsFound")}</ComboboxEmpty>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>{t("common:actions.cancel")}</Button>
            <Button type="submit" disabled={!title.trim() || !selectedCollection.code || loading}>
              {loading ? t("common:status.creating") : t("common:actions.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}