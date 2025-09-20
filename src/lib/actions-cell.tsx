"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Archive, Copy, Download, Edit, Eye, MessageCircle, MoreHorizontal, Share, Star, Trash2 } from "lucide-react";

type ActionOptions<TData> = {
  showInitial?: boolean;
};

type Props<TData> = {
  row: TData;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onCopy?: (row: TData) => void;
  onDownload?: (row: TData) => void;
  onShare?: (row: TData) => void;
  onArchive?: (row: TData) => void;
  onFavorite?: (row: TData) => void;
  onComment?: (row: TData) => void;
  customActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
    separator?: boolean;
    showInitial?: boolean;
  }>;
  actionOptions?: {
    view?: ActionOptions<TData>;
    edit?: ActionOptions<TData>;
    delete?: ActionOptions<TData>;
    copy?: ActionOptions<TData>;
    download?: ActionOptions<TData>;
    share?: ActionOptions<TData>;
    archive?: ActionOptions<TData>;
    favorite?: ActionOptions<TData>;
    comment?: ActionOptions<TData>;
  };
};

export function ActionsCell<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  onCopy,
  onDownload,
  onShare,
  onArchive,
  onFavorite,
  onComment,
  customActions = [],
  actionOptions = {},
}: Props<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const renderedCustomActions = React.useMemo(() => {
    return customActions.map((action, index) => (
      <React.Fragment key={index}>
        {action.separator && index > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem
          onClick={() => action.onClick(row)}
          className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
        >
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </DropdownMenuItem>
      </React.Fragment>
    ));
  }, [customActions, row]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {onView && actionOptions.view?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onView(row)} className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && actionOptions.edit?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(row)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onCopy && actionOptions.copy?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onCopy(row)} className="h-8 w-8 p-0">
            <Copy className="h-4 w-4" />
          </Button>
        )}
        {onDownload && actionOptions.download?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onDownload(row)} className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        )}
        {onShare && actionOptions.share?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onShare(row)} className="h-8 w-8 p-0">
            <Share className="h-4 w-4" />
          </Button>
        )}
        {onFavorite && actionOptions.favorite?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onFavorite(row)} className="h-8 w-8 p-0">
            <Star className="h-4 w-4" />
          </Button>
        )}
        {onComment && actionOptions.comment?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onComment(row)} className="h-8 w-8 p-0">
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
        {onArchive && actionOptions.archive?.showInitial && (
          <Button variant="ghost" size="sm" onClick={() => onArchive(row)} className="h-8 w-8 p-0">
            <Archive className="h-4 w-4" />
          </Button>
        )}
        {onDelete && actionOptions.delete?.showInitial && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onView && !actionOptions.view?.showInitial && (
              <DropdownMenuItem onClick={() => onView(row)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            {onEdit && !actionOptions.edit?.showInitial && (
              <DropdownMenuItem onClick={() => onEdit(row)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onCopy && !actionOptions.copy?.showInitial && (
              <DropdownMenuItem onClick={() => onCopy(row)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            {onDownload && !actionOptions.download?.showInitial && (
              <DropdownMenuItem onClick={() => onDownload(row)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            )}
            {onShare && !actionOptions.share?.showInitial && (
              <DropdownMenuItem onClick={() => onShare(row)}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            )}
            {onFavorite && !actionOptions.favorite?.showInitial && (
              <DropdownMenuItem onClick={() => onFavorite(row)}>
                <Star className="mr-2 h-4 w-4" />
                Favorite
              </DropdownMenuItem>
            )}
            {onComment && !actionOptions.comment?.showInitial && (
              <DropdownMenuItem onClick={() => onComment(row)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Comment
              </DropdownMenuItem>
            )}
            {onArchive && !actionOptions.archive?.showInitial && (
              <DropdownMenuItem onClick={() => onArchive(row)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
            {customActions.length > 0 && renderedCustomActions}
            {onDelete && !actionOptions.delete?.showInitial && (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
