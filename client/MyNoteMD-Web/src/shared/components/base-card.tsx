import React from "react";

interface BaseCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BaseCard = ({ children, actions, icon, className = "", onClick }: BaseCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-5 rounded-3xl bg-card border transition-all hover:bg-accent/50 active:scale-[0.99] cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all group ${className}`}>
      <div className="flex items-center gap-5">
        {/* Icon Area */}
        {icon && (
          <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon}
          </div>
        )}

        <div className="space-y-1">
          {children}
        </div>
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Actions Area */}
        {actions}
      </div>
    </div>
  );
};
