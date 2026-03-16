import React from "react";
import { Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface NoteErrorStateProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export const NoteErrorState = ({
  title = t("common:error.accessDenied"),
  message = t("notePreviewPage:error.accessDeniedMessage"),
  showHomeButton = true,
}: NoteErrorStateProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("notePreviewPage");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150" />
        <div className="relative h-20 w-20 bg-card border rounded-3xl flex items-center justify-center shadow-xl">
          <Lock className="h-10 w-10 text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
        {title}
      </h2>

      <p className="text-muted-foreground max-w-xs mx-auto mb-8 font-medium leading-relaxed">
        {message}
      </p>

      {showHomeButton && (
        <Button
          onClick={() => navigate("/home")}
          variant="outline"
          className="rounded-2xl gap-2 font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Home className="h-4 w-4" />
          {t("notePreviewPage:actions.backToHome")}
        </Button>
      )}
    </div>
  );
};
