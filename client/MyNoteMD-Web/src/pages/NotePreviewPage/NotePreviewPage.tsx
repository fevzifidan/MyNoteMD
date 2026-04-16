import React from "react";
import MarkdownPreview from "../Note/shared/MarkdownPreview";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import apiService from "@/shared/services/api";
import notificationService from "@/shared/services/notification";
import { TopNav } from "@/features/navbar/top-right-nav";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { NoteErrorState } from "@/shared/components/note-error-state";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, MoreHorizontal, Download } from "lucide-react";
import { ModeToggle, ModeToggleOption } from "@/shared/components/mode-toggle";
import { useTranslation } from "react-i18next";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import downloadMyNoteMD from "./helpers/exportMyNoteMD";

const NotePreviewPage = ({ isPublic = false }: { isPublic?: boolean }) => {
    const { id } = useParams();
    const [draftNote, setDraftNote] = React.useState<string | null>(null);
    const [publishedNote, setPublishedNote] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [contentMode, setContentMode] = React.useState<'draft' | 'published'>('published');
    const { t } = useTranslation(["commons", "notePreviewPage"]);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const contentModeOptions: ModeToggleOption<'draft' | 'published'>[] = [
        { value: 'draft', icon: FileText, label: t("common:status.draft") },
        { value: 'published', icon: CheckCircle2, label: t("common:status.final") },
    ];

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: id || "note",
    });

    const handleDownloadMyNoteMD = () => {
        const content = contentMode === 'draft' ? draftNote : publishedNote;
        downloadMyNoteMD(content || "", id || "note");
    };

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
            <main className="pt-24 px-4 pb-10 sm:pt-16 sm:px-6 lg:pt-16 lg:px-8 max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                ) : error ? (
                    <NoteErrorState />
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-end gap-2 mb-4">
                            <ModeToggle
                                value={contentMode}
                                onValueChange={setContentMode}
                                options={contentModeOptions}
                            />
                            <ButtonGroup>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handlePrint()}
                                    className="rounded-full gap-2 px-4 shadow-sm"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span>{t("notePreviewPage:actions.downloadPDF")}</span>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full gap-2 px-4 shadow-sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handlePrint()}>
                                            <Download className="h-4 w-4 mr-2" />
                                            <span>{t("notePreviewPage:actions.downloadPDF")}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownloadMyNoteMD()}>
                                            <Download className="h-4 w-4 mr-2" />
                                            <span>{t("notePreviewPage:actions.downloadMyNoteMD")}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </ButtonGroup>

                        </div>
                        <div
                            ref={contentRef}
                            className="print-container bg-background"
                        >
                            <style>
                                {`
                                    @media print {
                                        @page {
                                            size: A4;
                                            margin: 20mm;
                                        }
                                        body {
                                            background-color: white !important;
                                            color: black !important;
                                            -webkit-print-color-adjust: exact;
                                        }
                                        .print-container {
                                            background-color: white !important;
                                            color: black !important;
                                            width: 100% !important;
                                            padding: 0 !important;
                                            margin: 0 !important;
                                        }
                                        /* Force light mode and reset dark mode typography */
                                        .print-container .prose,
                                        .print-container .dark .prose,
                                        .print-container .prose.dark\\:prose-invert {
                                            --tw-prose-body: #374151 !important;
                                            --tw-prose-headings: #111827 !important;
                                            --tw-prose-lead: #4b5563 !important;
                                            --tw-prose-links: #111827 !important;
                                            --tw-prose-bold: #111827 !important;
                                            --tw-prose-counters: #6b7280 !important;
                                            --tw-prose-bullets: #d1d5db !important;
                                            --tw-prose-hr: #e5e7eb !important;
                                            --tw-prose-quotes: #111827 !important;
                                            --tw-prose-quote-borders: #e5e7eb !important;
                                            --tw-prose-captions: #6b7280 !important;
                                            --tw-prose-code: #111827 !important;
                                            --tw-prose-pre-code: #e5e7eb !important;
                                            --tw-prose-pre-bg: #1f2937 !important;
                                            --tw-prose-th-borders: #d1d5db !important;
                                            --tw-prose-td-borders: #e5e7eb !important;
                                            
                                            color: #1a1a1a !important;
                                            max-width: none !important;
                                        }
                                        .print-container .prose h1, 
                                        .print-container .prose h2, 
                                        .print-container .prose h3 {
                                            color: #000 !important;
                                            page-break-after: avoid;
                                        }
                                        .print-container .prose p, 
                                        .print-container .prose li {
                                            page-break-inside: auto;
                                        }
                                        .print-container .prose pre, 
                                        .print-container .prose blockquote,
                                        .print-container .prose table,
                                        .print-container .prose img {
                                            page-break-inside: avoid;
                                        }
                                        /* Block Code Containers (Syntax Highlighter) */
                                        .print-container .prose pre,
                                        .print-container .prose div:has(> code),
                                        .print-container .prose [style*="background-color"]:has(code) {
                                            background-color: #f8f9fa !important;
                                            color: #212529 !important;
                                            border: 1px solid #dee2e6 !important;
                                            padding: 1em !important;
                                            margin: 1em 0 !important;
                                            border-radius: 6px !important;
                                        }
                                        /* Inline Code (Not inside a block) */
                                        .print-container .prose :not(pre):not(div) > code {
                                            color: #24292e !important;
                                            background-color: #f1f2f3 !important;
                                            padding: 2px 4px !important;
                                            border-radius: 4px !important;
                                            font-size: 0.9em !important;
                                            border: none !important;
                                        }
                                        /* Reset Code inside blocks so it doesn't have its own background */
                                        .print-container .prose pre code,
                                        .print-container .prose div > code {
                                            background-color: transparent !important;
                                            padding: 0 !important;
                                            color: inherit !important;
                                            border: none !important;
                                        }
                                        /* Professional Light-Theme Syntax Highlighting Overrides */
                                        .print-container .prose pre span,
                                        .print-container .prose div > code span {
                                            color: inherit !important;
                                            background-color: transparent !important;
                                        }
                                        .print-container .prose .token.keyword,
                                        .print-container .prose .token.selector,
                                        .print-container .prose .token.important,
                                        .print-container .prose .token.atrule {
                                            color: #d73a49 !important;
                                            font-weight: 600 !important;
                                        }
                                        .print-container .prose .token.string,
                                        .print-container .prose .token.char,
                                        .print-container .prose .token.attr-value,
                                        .print-container .prose .token.regex,
                                        .print-container .prose .token.variable {
                                            color: #032f62 !important;
                                        }
                                        .print-container .prose .token.comment,
                                        .print-container .prose .token.prolog,
                                        .print-container .prose .token.doctype,
                                        .print-container .prose .token.cdata {
                                            color: #6a737d !important;
                                            font-style: italic !important;
                                        }
                                        .print-container .prose .token.function,
                                        .print-container .prose .token.class-name {
                                            color: #6f42c1 !important;
                                        }
                                        .print-container .prose .token.constant,
                                        .print-container .prose .token.boolean,
                                        .print-container .prose .token.number {
                                            color: #005cc5 !important;
                                        }
                                        .print-container .prose .token.operator,
                                        .print-container .prose .token.entity,
                                        .print-container .prose .token.url {
                                            color: #d73a49 !important;
                                        }
                                    }
                                `}
                            </style>
                            <MarkdownPreview markdown={contentMode === 'draft' ? (draftNote || "") : (publishedNote || "")} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotePreviewPage;