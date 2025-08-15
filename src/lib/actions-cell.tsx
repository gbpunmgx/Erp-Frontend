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
  }>;
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

  const hasPrimaryActions = onView ?? onEdit;
  const hasDropdownActions =
    onView ??
    onEdit ??
    onCopy ??
    onDownload ??
    onShare ??
    onFavorite ??
    onComment ??
    onArchive ??
    onDelete ??
    customActions.length > 0;

  if (!hasPrimaryActions && !hasDropdownActions) {
    return null;
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row);
      setShowDeleteDialog(false);
    }
  };

  const needsSeparator =
    (onArchive ?? onDelete) &&
    (onView ?? onEdit ?? onCopy ?? onDownload ?? onShare ?? onFavorite ?? onComment ?? customActions.length > 0);

  return (
    <>
      <div className="flex items-center gap-2">
        {onView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row)}
            className="hover:bg-accent/50 h-8 w-8 p-0 transition-all duration-300"
            aria-label="View row"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row)}
            className="hover:bg-accent/50 h-8 w-8 p-0 transition-all duration-300"
            aria-label="Edit row"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {hasDropdownActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-accent/50 h-8 w-8 p-0 transition-all duration-300"
                aria-label="More actions"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onView && (
                <DropdownMenuItem onClick={() => onView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onCopy && (
                <DropdownMenuItem onClick={() => onCopy(row)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDownload && (
                <DropdownMenuItem onClick={() => onDownload(row)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(row)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
              )}
              {onFavorite && (
                <DropdownMenuItem onClick={() => onFavorite(row)}>
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
              )}
              {onComment && (
                <DropdownMenuItem onClick={() => onComment(row)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add Comment
                </DropdownMenuItem>
              )}
              {customActions.length > 0 && <>{renderedCustomActions}</>}
              {needsSeparator && <DropdownMenuSeparator />}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(row)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              {onDelete && (
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
        )}
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
