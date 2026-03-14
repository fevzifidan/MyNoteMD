import React from "react";
import MarkdownPreview from "../Note/shared/MarkdownPreview";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { TopNav } from "@/features/navbar/top-right-nav";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { NoteErrorState } from "@/shared/components/note-error-state";
import { Button } from "@/components/ui/button";
import { History, CheckCircle2 } from "lucide-react";

const NotePreviewPage = ({ isPublic = false }: { isPublic?: boolean }) => {
    const { id } = useParams();
    const [draftNote, setDraftNote] = React.useState<string | null>(null);
    const [publishedNote, setPublishedNote] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [contentMode, setContentMode] = React.useState<'draft' | 'published'>('published');
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchNote = async () => {
            try {
                if (isPublic) {
                    const res: any = await apiService.get(`/notes/public/${id}`);
                    setDraftNote(res.content || "");
                    setPublishedNote(res.publishedContent || "");
                } else {
                    const res: any = await apiService.get(`/notes/${id}`);
                    setDraftNote(res.content || "");
                    setPublishedNote(res.publishedContent || "");
                }
            }
            catch (error: any) {
                setError(true);
                notificationService.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();

    }, [id, isPublic]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopNav collapse={false} />
            <Sidebar />
            <main className="pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <NoteErrorState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-end gap-2 mb-4">
                            <Button
                                size="sm"
                                variant={contentMode === 'draft' ? 'default' : 'outline'}
                                onClick={() => setContentMode('draft')}
                                className="rounded-full gap-2 px-4 shadow-sm"
                            >
                                <History className="h-4 w-4" />
                                <span>Draft</span>
                            </Button>
                            <Button
                                size="sm"
                                variant={contentMode === 'published' ? 'default' : 'outline'}
                                onClick={() => setContentMode('published')}
                                className="rounded-full gap-2 px-4 shadow-sm"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Final Version</span>
                            </Button>
                        </div>
                        <MarkdownPreview markdown={contentMode === 'draft' ? (draftNote || "") : (publishedNote || "")} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotePreviewPage;