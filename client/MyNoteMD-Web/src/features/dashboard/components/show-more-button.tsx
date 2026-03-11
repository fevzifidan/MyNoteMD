import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShowMoreButtonProps {
  endpoint: string;
}

export const ShowMoreButton = ({ endpoint }: ShowMoreButtonProps) => {
    const navigate = useNavigate();
    return (
        <div className="pt-2 px-2">
            <Button onClick={() => navigate(endpoint)}
                variant="ghost" 
                className="group text-muted-foreground hover:text-foreground font-semibold text-sm h-10 px-4 rounded-xl transition-all"
            >
                Show more
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
    );
};