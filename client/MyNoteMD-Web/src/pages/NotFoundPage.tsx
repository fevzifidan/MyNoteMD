import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation("notFound");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground transition-colors duration-300">
      <div className="space-y-8 max-w-md w-full text-center">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-2xl" />
          <div className="relative flex items-center justify-center w-full h-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden group">
            <FileQuestion className="w-12 h-12 sm:w-16 sm:h-16 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed px-4">
            {t("description")}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto h-12 px-8 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            onClick={() => navigate("/home")}
          >
            <Home className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </div>
      </div>

      {/* Subtle background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
