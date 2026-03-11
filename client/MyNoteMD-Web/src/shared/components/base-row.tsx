import React from "react";

interface BaseRowProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const BaseRow = ({ children, onClick, actions, icon, className = "" }: BaseRowProps) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-3 rounded-xl transition-all hover:bg-accent/50 active:scale-[0.98] cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Icon Area */}
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            {icon}
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-1">
          {children}
        </div>
      </div>

      <div className="flex items-center gap-3 pr-2">
        {/* Actions Area */}
        {actions && (
          <div onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}

        {/* Decorative Dot/Status */}
        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20 group-hover:bg-muted-foreground/40 transition-colors mr-2" />
      </div>
    </div>
  );
};
