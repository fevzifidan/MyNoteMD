"use client";

import { useState, useEffect, useMemo } from "react";
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

// Type for Combobox
type ComboboxOption = {
  code: string;  // ID
  value: string; // Search
  label: string; // Display
};

interface CreateNoteDialogProps {
  isExpanded?: boolean;
  collectionId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function CreateNoteDialog({
  isExpanded,
  collectionId: propCollectionId,
  open: propOpen,
  onOpenChange: propOnOpenChange,
  hideTrigger = false
}: CreateNoteDialogProps) {
  const { t } = useTranslation(["createNoteDialog", "common"]);

  // Internal state for uncontrolled usage
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if component is controlled or uncontrolled
  const isControlled = propOpen !== undefined;
  const open = isControlled ? propOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      propOnOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  // Defined inside component so t() is called after namespaces are loaded
  const defaultOption = useMemo<ComboboxOption>(
    () => ({ code: "", value: "", label: t("createNoteDialog:selectCollection") }),
    [t]
  );

  const [loading, setLoading] = useState(false);
  const [fetchingCollections, setFetchingCollections] = useState(false);

  const [title, setTitle] = useState("");
  const [collections, setCollections] = useState<ComboboxOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<ComboboxOption | null>(null);

  useEffect(() => {
    if (open) {
      // If collectionId is provided via props, we don't necessarily need to fetch all collections
      // but we set the selected collection to match the prop
      if (propCollectionId) {
        setSelectedCollection({
          code: propCollectionId,
          label: "", // We don't need label if we aren't showing the select
          value: ""
        });
      }

      const fetchCollections = async () => {
        if (propCollectionId) return; // Skip fetching if pre-selected

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
          notificationService.error(t("common:error.generic"));
        } finally {
          setFetchingCollections(false);
        }
      };
      fetchCollections();
    } else {
      // Reset the form when the dialog closes
      setTitle("");
      setSelectedCollection(null);
    }
  }, [open, defaultOption, propCollectionId, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const collectionIdToUse = propCollectionId || selectedCollection?.code;

    if (!title.trim() || !collectionIdToUse) {
      notificationService.error(t("common:error.fill_all_fields"));
      return;
    }

    setLoading(true);
    try {
      await noteService.create({
        title: title,
        collectionId: collectionIdToUse
      });
      notificationService.success(t("createNoteDialog:success"));
      setOpen(false);
    } catch (error) {
      notificationService.error(t("common:error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      {!hideTrigger && (
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
      )}

      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
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

            {!propCollectionId && (
              <div className="space-y-2 flex flex-col">
                <Label>{t("createNoteDialog:collection")}</Label>
                <Combobox
                  items={collections}
                  value={selectedCollection ?? defaultOption}
                  onValueChange={(value) => setSelectedCollection(value ?? null)}
                  disabled={fetchingCollections}
                >
                  <ComboboxTrigger
                    render={
                      <Button variant="outline" className="w-full justify-between font-normal">
                        <ComboboxValue />
                      </Button>
                    }
                  />
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
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>{t("common:actions.cancel")}</Button>
            <Button type="submit" disabled={!title.trim() || (!propCollectionId && !selectedCollection?.code) || loading}>
              {loading ? t("common:status.creating") : t("common:actions.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}