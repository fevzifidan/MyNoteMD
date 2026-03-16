import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import i18n from "../../../i18n";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string | null;
  fullScreen?: boolean;
  localOverlay?: boolean;
}

const LoadingSpinner = ({
  className,
  size = 32,
  text = i18n.t("common:status.loading"),
  fullScreen = false,
  localOverlay = false,
}: LoadingSpinnerProps) => {

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2
        className="animate-spin text-current"
        size={size}
      />
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse text-center">
          {text}
        </p>
      )}
    </div>
  );

  // Case 1: Full Screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-6">
        {content}
      </div>
    );
  }

  // Case 2: (Local Overlay)
  if (localOverlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-inherit">
        {content}
      </div>
    );
  }

  // Case 3: Inline
  return content;
};

export default LoadingSpinner;