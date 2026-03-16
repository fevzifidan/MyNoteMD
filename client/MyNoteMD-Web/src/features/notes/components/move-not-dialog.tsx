"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { noteService, collectionService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";
import { useTranslation } from "react-i18next";

// Type for Combobox
type ComboboxOption = {
    code: string;  // We keep the ID (Guid) from the Backend here
    value: string; // The field to search in (lowercase name)
    label: string; // The field to display to the user (original name)
};

const defaultOption: ComboboxOption = { code: "", value: "", label: "Select a collection" };

interface MoveNoteDialogProps {
    noteId: string;
    isExpanded?: boolean;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function MoveNoteDialog({ noteId, isExpanded = true, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: MoveNoteDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    const [loading, setLoading] = useState(false);
    const [fetchingCollections, setFetchingCollections] = useState(false);

    const [collections, setCollections] = useState<ComboboxOption[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<ComboboxOption>(defaultOption);

    const { t } = useTranslation(["moveNoteDialog", "common"]);

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
                            code: itemId,                    // ID to send to API (Örn: 3fa85f64...)
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
            setSelectedCollection(defaultOption);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCollection.code) {
            notificationService.error(t("moveNoteDialog:noCollectionsFound"));
            return;
        }

        setLoading(true);
        try {
            await noteService.move(noteId, selectedCollection.code);
            notificationService.success(t("moveNoteDialog:success"));
            setOpen(false);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => {
                    // Prevent closing when clicking outside if modal={false}
                    // This allows interacting with the Combobox portal without closing the dialog.
                    e.preventDefault();
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t("moveNoteDialog:title")}</DialogTitle>
                        <DialogDescription>{t("moveNoteDialog:description")}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        <div className="space-y-2 flex flex-col">
                            <Label>{t("moveNoteDialog:targetCollection")}</Label>
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
                                {/* z-index eklendi: Dialog overlay'inin altında kalıp tıklanmayı engellememesi için */}
                                <ComboboxContent className="z-[9999]">
                                    <ComboboxInput showTrigger={false} placeholder={t("moveNoteDialog:searchPlaceholder")} />
                                    <ComboboxEmpty>{t("moveNoteDialog:noCollectionsFound")}</ComboboxEmpty>
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
                        <Button type="submit" disabled={!selectedCollection.code || loading}>
                            {loading ? t("common:status.moving") : t("common:actions.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}