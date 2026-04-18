import { useParams } from "react-router-dom";
import { NoteErrorState } from "@/shared/components/note-error-state";
import { ThemeToggle } from "@/components/custom/ThemeToggle/ThemeToggle";
import { useNotePreview } from "@/features/notes/hooks/use-note-preview";
import MarkdownPreview from "@/shared/components/markdown-preview/MarkdownPreview";

const GuestPreviewPage = () => {
    const { id } = useParams<{ id: string }>();

    const {
        currentContent,
        loading,
        error
    } = useNotePreview({ id, isPublic: true });

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ThemeToggle className="fixed top-4 right-4" />
            <main className="pt-12 pb-10 lg:pt-8 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <NoteErrorState />
                ) : (
                    <MarkdownPreview markdown={currentContent} />
                )}
            </main>
        </div>
    );
};

export default GuestPreviewPage;