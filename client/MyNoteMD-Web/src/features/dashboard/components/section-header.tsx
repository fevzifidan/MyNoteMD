import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader = ({ title, className }: SectionHeaderProps) => {
  return (
    <CardHeader className={cn("px-2 pb-4 pt-0", className)}>
      <CardTitle className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground/80">
        {title}
      </CardTitle>
    </CardHeader>
  );
};