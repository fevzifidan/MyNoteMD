import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import notificationService from "@/shared/services/notification";
import apiService from "@/shared/services/api/api.service";
import { useConfirm } from "@/shared/services/confirmation/useConfirm";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "@/components/custom/LoadingSpinner/LoadingSpinner";

interface TrashItemProps {
    id?: string;
    type: string;
    title?: string;
    deletedAt?: string;
    parentCollectionName?: string;
    affectedNotesCount?: number;
}

export default function TrashItem({ id, type, title, deletedAt, parentCollectionName, affectedNotesCount }: TrashItemProps) {
    const confirm = useConfirm();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async () => {
        setIsUpdating(true);

        try {
            const ok = await confirm.confirm({
                title: `Delete ${type} Permanently`,
                description: `Are you sure you want to delete this ${type} permanently?`,
                confirmText: "Yes",
                variant: "destructive",
                size: "sm",
                icon: <Trash2 />,
                iconSize: "md",
                dontAskAgain: { id: `delete-${type}-permanently`, label: "Don't ask this again" }
            });

            if (ok) {
                await apiService.delete(`/trash/${type}/${id}`);
                notificationService.info(`${type} deleted successfully.`);
            }
        } catch (error) {

        } finally {
            setIsUpdating(false);
        }
    };
    const handleRestore = async () => {
        setIsUpdating(true);
        try {
            await apiService.post(`/trash/${type}/${id}/restore`);
            notificationService.info(`${type} restored successfully.`);
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
                        <Button onClick={handleDelete}>Delete</Button>
                        <Button onClick={handleRestore}>Restore</Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}