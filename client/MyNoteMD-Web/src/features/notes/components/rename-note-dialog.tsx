"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { noteService } from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { useTranslation } from "react-i18next";

interface RenameNoteDialogProps {
    noteId: string;
    initialTitle: string;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onRenameSuccess?: (newTitle: string) => void;
}

export function RenameNoteDialog({ noteId, initialTitle, trigger, open: controlledOpen, onOpenChange: setControlledOpen, onRenameSuccess }: RenameNoteDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(initialTitle);

    const { t } = useTranslation(["common", "renameNoteDialog"]);

    useEffect(() => {
        if (open) {
            setTitle(initialTitle);
        }
    }, [open, initialTitle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            notificationService.error(t("common:error.fill_all_fields"));
            return;
        }

        if (title.trim() === initialTitle) {
            // If the name hasn't changed, just close it
            setOpen(false);
            return;
        }

        setLoading(true);
        try {
            await noteService.update(noteId, { title: title.trim() });
            notificationService.success(t("renameNoteDialog:success", { defaultValue: "Note renamed successfully" }));
            if (onRenameSuccess) {
                onRenameSuccess(title.trim());
            }
            setOpen(false);
        } catch (error) {
            // Error is handled by global interceptor usually
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t("renameNoteDialog:title", { defaultValue: "Rename Note" })}</DialogTitle>
                        <DialogDescription>{t("renameNoteDialog:description", { defaultValue: "Enter a new name for your note." })}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("common:title", { defaultValue: "Title" })}</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>{t("common:actions.cancel")}</Button>
                        <Button type="submit" disabled={!title.trim() || loading}>
                            {loading ? t("common:status.saving", { defaultValue: "Saving..." }) : t("common:actions.save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
