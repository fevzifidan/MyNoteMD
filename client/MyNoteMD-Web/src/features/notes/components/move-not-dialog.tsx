"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { noteService, collectionService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox";

// Combobox'ın tam olarak beklediği tip (senin ülkeler örneğindeki yapı)
type ComboboxOption = {
    code: string;  // Backend'deki ID'yi (Guid) burada tutacağız
    value: string; // Arama (search) işleminin yapılacağı alan (küçük harf isim)
    label: string; // Ekranda kullanıcıya gösterilecek alan (orijinal isim)
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

    useEffect(() => {
        if (open) {
            const fetchCollections = async () => {
                setFetchingCollections(true);
                try {
                    const response = await collectionService.lookup();
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
            setSelectedCollection(defaultOption);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCollection.code) {
            notificationService.error("Please select a collection.");
            return;
        }

        setLoading(true);
        try {
            await noteService.move(noteId, selectedCollection.code);
            notificationService.success("Note moved successfully!");
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
                        <DialogTitle>Move Note</DialogTitle>
                        <DialogDescription>Move the note to a different collection.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        <div className="space-y-2 flex flex-col">
                            <Label>Target Collection</Label>
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
                        <Button type="submit" disabled={!selectedCollection.code || loading}>
                            {loading ? "Moving..." : "Move Note"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}