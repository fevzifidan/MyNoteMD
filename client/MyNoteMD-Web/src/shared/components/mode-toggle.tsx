import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface ModeToggleOption<T extends string> {
  value: T;
  icon: LucideIcon;
  label: string;
}

interface ModeToggleProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: ModeToggleOption<T>[];
  className?: string;
  showLabels?: boolean;
}

export function ModeToggle<T extends string>({
  value,
  onValueChange,
  options,
  className,
  showLabels = false,
}: ModeToggleProps<T>) {
  return (
    <ButtonGroup className={cn("shadow-sm rounded-full", className)}>
      {options.map((option) => {
        const ButtonContent = (
          <Button
            key={option.value}
            size="sm"
            variant={value === option.value ? 'default' : 'outline'}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "rounded-full px-3 transition-all",
              showLabels ? "gap-2 px-4" : "px-3"
            )}
          >
            <option.icon className="h-4 w-4" />
            {showLabels && <span>{option.label}</span>}
          </Button>
        );

        if (showLabels) {
          return ButtonContent;
        }

        return (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              {ButtonContent}
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {option.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </ButtonGroup>
  );
}
