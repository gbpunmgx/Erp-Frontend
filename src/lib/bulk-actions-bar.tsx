import * as React from "react";
import { Button } from "@/components/ui/button";
import { Archive, Copy, Download, Edit, Eye, Heart, MessageCircle, Share, Trash2, X } from "lucide-react";

export function BulkActionsBar<TData>({
  selectedCount,
  onClearSelection,
  bulkActions,
  selectedRows,
}: {
  selectedCount: number;
  onClearSelection: () => void;
  bulkActions?: {
    onBulkDelete?: (rows: TData[]) => void;
    onBulkDownload?: (rows: TData[]) => void;
    onBulkArchive?: (rows: TData[]) => void;
    onBulkCopy?: (rows: TData[]) => void;
    onBulkView?: (rows: TData[]) => void;
    onBulkEdit?: (rows: TData[]) => void;
    onBulkShare?: (rows: TData[]) => void;
    onBulkFavorite?: (rows: TData[]) => void;
    onBulkComment?: (rows: TData[]) => void;
    customActions?: Array<{
      label: string;
      icon?: React.ComponentType<{ className?: string }>;
      onClick: (rows: TData[]) => void;
      variant?: "default" | "destructive";
    }>;
  };
  selectedRows: TData[];
}) {
  if (selectedCount === 0) return null;

  const allActions = [
    {
      key: "view",
      label: "View",
      icon: Eye,
      onClick: bulkActions?.onBulkView,
      variant: "default" as const,
    },
    {
      key: "edit",
      label: "Edit",
      icon: Edit,
      onClick: bulkActions?.onBulkEdit,
      variant: "default" as const,
    },
    {
      key: "copy",
      label: "Copy",
      icon: Copy,
      onClick: bulkActions?.onBulkCopy,
      variant: "default" as const,
    },
    {
      key: "download",
      label: "Download",
      icon: Download,
      onClick: bulkActions?.onBulkDownload,
      variant: "default" as const,
    },
    {
      key: "share",
      label: "Share",
      icon: Share,
      onClick: bulkActions?.onBulkShare,
      variant: "default" as const,
    },
    {
      key: "favorite",
      label: "Favorite",
      icon: Heart,
      onClick: bulkActions?.onBulkFavorite,
      variant: "default" as const,
    },
    {
      key: "comment",
      label: "Comment",
      icon: MessageCircle,
      onClick: bulkActions?.onBulkComment,
      variant: "default" as const,
    },
    {
      key: "archive",
      label: "Archive",
      icon: Archive,
      onClick: bulkActions?.onBulkArchive,
      variant: "default" as const,
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      onClick: bulkActions?.onBulkDelete,
      variant: "destructive" as const,
    },
  ].filter((action) => action.onClick);

  return (
    <div className="bg-primary/10 border-primary/30 animate-in slide-in-from-top-2 flex items-center justify-between border-b px-6 py-3 duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
          <span className="text-primary text-sm font-semibold">{selectedCount}</span>
        </div>
        <span className="text-foreground text-sm font-medium">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        {allActions.map((action) => (
          <Button
            key={action.key}
            variant="outline"
            size="sm"
            onClick={() => action.onClick?.(selectedRows)}
            className={`h-8 px-3 ${
              action.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                : "hover:bg-primary/10 hover:text-primary"
            }`}
            title={action.label}
          >
            <action.icon className="mr-1 h-3 w-3" />
            {action.label}
          </Button>
        ))}

        {bulkActions?.customActions?.map((action, index) => (
          <Button
            key={`custom-${index}`}
            variant="outline"
            size="sm"
            onClick={() => action.onClick(selectedRows)}
            className={`h-8 px-3 ${
              action.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                : "hover:bg-primary/10 hover:text-primary"
            }`}
            title={action.label}
          >
            {action.icon && <action.icon className="mr-1 h-3 w-3" />}
            {action.label}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground hover:bg-accent/30 h-8 px-3"
          title="Clear selection"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      </div>
    </div>
  );
}
