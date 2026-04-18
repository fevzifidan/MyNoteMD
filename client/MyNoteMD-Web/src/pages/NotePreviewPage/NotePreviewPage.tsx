import { useParams } from "react-router-dom";
import { TopNav } from "@/features/navbar/top-right-nav";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { NoteErrorState } from "@/shared/components/note-error-state";
import { CheckCircle2, FileText } from "lucide-react";
import { ModeToggle, type ModeToggleOption } from "@/shared/components/mode-toggle";
import { useTranslation } from "react-i18next";
import { NoteDownloadActions } from "@/features/notes/components/note-download-actions";
import { useNotePreview } from "@/features/notes/hooks/use-note-preview";
import MarkdownPreview from "@/shared/components/markdown-preview/MarkdownPreview";

const NotePreviewPage = ({ isPublic = false }: { isPublic?: boolean }) => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation(["commons", "notePreviewPage"]);

    const {
        currentContent,
        contentMode,
        setContentMode,
        loading,
        error
    } = useNotePreview({ id, isPublic });

    const contentModeOptions: ModeToggleOption<'draft' | 'published'>[] = [
        { value: 'draft', icon: FileText, label: t("common:status.draft") },
        { value: 'published', icon: CheckCircle2, label: t("common:status.final") },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopNav collapse={false} />
            <Sidebar />
            <main className="pt-24 px-4 pb-10 sm:pt-16 sm:px-6 lg:pt-16 lg:px-8 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <NoteErrorState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 mb-4">
                            <ModeToggle
                                value={contentMode}
                                onValueChange={setContentMode}
                                options={contentModeOptions}
                            />
                            <NoteDownloadActions
                                content={currentContent}
                                noteId={id || "note"}
                            />
                        </div>
                        <div className="print-container bg-background">
                            <MarkdownPreview markdown={currentContent} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotePreviewPage;