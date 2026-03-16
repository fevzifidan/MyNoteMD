import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import notificationService from "@/shared/services/notification";
import { trashService } from "@/shared/services/api";
import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "@/components/custom/LoadingSpinner/LoadingSpinner";
import { useTranslation } from "react-i18next";

interface TrashItemProps {
    id?: string;
    type: string;
    title?: string;
    deletedAt?: string;
    parentCollectionName?: string;
    affectedNotesCount?: number;
}

export default function TrashItem({ id, type, title, deletedAt, parentCollectionName, affectedNotesCount }: TrashItemProps) {
    const { t } = useTranslation(["common", "trashPage"]);
    const confirm = useConfirm();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async () => {
        setIsUpdating(true);

        try {
            const ok = await confirm.confirm({
                title: t(`trashPage:deletePermanently`),
                description: t(`trashPage:emptyTrashConfirmDescription`),
                confirmText: t(`trashPage:deletePermanently`),
                variant: "destructive",
                size: "sm",
                icon: <Trash2 />,
                iconSize: "md",
                dontAskAgain: { id: `delete-${type}-permanently`, label: t(`common:choices.doNotAskAgain`) }
            });

            if (ok) {
                await trashService.permanentDelete(type, id as string);
                notificationService.info(`${t(`trashPage:deleteSuccessful`)}`);
            }
        } catch (error) {

        } finally {
            setIsUpdating(false);
        }
    };
    const handleRestore = async () => {
        setIsUpdating(true);
        try {
            await trashService.restore(type, id as string);
            notificationService.info(`${t(`trashPage:restoreSuccessful`)}`);
        } catch (error) {

        } finally {
            setIsUpdating(false);
        }
    }
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{deletedAt}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{parentCollectionName}</p>
                    <p>{affectedNotesCount}</p>
                </CardContent>
                {isUpdating && <LoadingSpinner />}
                {!isUpdating && (
                    <CardFooter>
                        <Button onClick={handleDelete} variant="destructive">{t(`trashPage:delete`)}</Button>
                        <Button onClick={handleRestore}>{t(`trashPage:restore`)}</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}