import React from "react";
import MarkdownPreview from "../Note/shared/MarkdownPreview";
import { useParams } from "react-router-dom";
import apiService from "@/shared/services/api";
import { NoteErrorState } from "@/shared/components/note-error-state";
import { ThemeToggle } from "@/components/custom/ThemeToggle/ThemeToggle";

const GuestPreviewPage = () => {
    const { id } = useParams();
    const [note, setNote] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await apiService.get(`/notes/public/${id}`, { silent: true });
                setNote(res.content || "");
            }
            catch (error: any) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();

    }, [id]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <ThemeToggle className="fixed top-4 right-4" />
            <main className="pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <NoteErrorState />
                ) : (
                    <MarkdownPreview markdown={note || ""} />
                )}
            </main>
        </div>
    );
};

export default GuestPreviewPage;