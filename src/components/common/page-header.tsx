"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onActionClick?: () => void;
  showActionButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onActionClick,
  showActionButton = true,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          {Icon && <Icon className="text-primary h-8 w-8" />}
          <span>{title}</span>
        </h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>

      {showActionButton && actionLabel && <Button onClick={onActionClick}>{actionLabel}</Button>}
    </div>
  );
};
