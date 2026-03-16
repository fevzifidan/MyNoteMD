import { useState, useCallback, useEffect } from "react";
import { trashService } from "@/shared/services/api";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import { SharedPagination } from "@/shared/components/shared-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import TrashItem from "./TrashItem";
import { useTranslation } from "react-i18next";

export default function TrashPage() {
    const { t } = useTranslation(["common", "trashPage"]);
    // States
    const [trashItems, setTrashItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Cursor stack to move previous pages
    const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

    const fetchTrash = useCallback(async (cursor: string | null) => {
        setLoading(true);
        try {
            const response = await trashService.list({
                cursor: cursor,
                limit: 20
            });

            const data = response as any;
            setTrashItems(data.items || []);
            setNextCursor(data.nextCursor || null);

        } catch (error) {
            setTrashItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrash(null);
    }, [fetchTrash]);

    const handleNext = () => {
        if (nextCursor) {
            setCursorStack((prev) => [...prev, nextCursor]);
            setCurrentPage((prev) => prev + 1);
            fetchTrash(nextCursor);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newStack = [...cursorStack];
            newStack.pop();
            const prevCursor = newStack[newStack.length - 1];
            setCursorStack(newStack);
            setCurrentPage((prev) => prev - 1);
            fetchTrash(prevCursor);
        }
    };
    console.log(trashItems);
    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-[400px]">
                {loading && trashItems.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                        <div className="grid grid-cols-1 gap-4">
                            {trashItems.map((item) => (
                                <TrashItem key={item.id} type={item.type} id={item.id} title={item.titleOrName} deletedAt={item.deletedAt} parentCollectionName={item.parentCollectionName} affectedNotesCount={item.affectedNotesCount} />
                            ))}
                        </div>
                        {!loading && trashItems.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-[3rem] border-muted/40">
                                <p className="text-xl font-medium text-muted-foreground">
                                    {t("trashPage:notFound")}
                                </p>
                                <p className="text-sm text-muted-foreground/60 mt-1">
                                    {t("trashPage:text")}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {trashItems.length > 0 && (
                    <div className="mt-10 mb-20">
                        <SharedPagination
                            currentPage={currentPage}
                            hasNextPage={!!nextCursor}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            disabled={loading}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}