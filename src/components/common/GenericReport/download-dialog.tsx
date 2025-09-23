import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, FileSpreadsheet, File, Download } from "lucide-react";
import { ColumnDef } from "./types";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface FormatButtonProps {
  format: "csv" | "excel" | "pdf";
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  isDownloading: boolean;
}

const FormatButton = ({ format, Icon, label, description, selected, onClick, isDownloading }: FormatButtonProps) => (
  <Button
    variant={selected ? "default" : "outline"}
    onClick={onClick}
    className={`flex h-12 items-start justify-start gap-2 p-3 sm:h-auto sm:items-center ${selected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent hover:text-accent-foreground"} w-full transition-all duration-200`}
    disabled={isDownloading}
  >
    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 sm:mt-0" />
    <div className="min-w-0 flex-1 text-left">
      <div className="truncate text-xs font-medium sm:text-sm">{label}</div>
      <div className="text-muted-foreground hidden truncate text-xs sm:block">{description}</div>
    </div>
  </Button>
);

interface DownloadOptionCardProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
  records: number | string;
  isDownloading: boolean;
}

const DownloadOptionCard = ({
  id,
  checked,
  onChange,
  title,
  description,
  records,
  isDownloading,
}: DownloadOptionCardProps) => (
  <div
    className={`flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-all duration-200 sm:p-4 ${checked ? "border-primary bg-primary/5 ring-primary/20 ring-1" : "border-border hover:bg-muted/50"} `}
    onClick={onChange}
  >
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="mt-0.5 h-4 w-4 flex-shrink-0"
      disabled={isDownloading}
    />
    <div className="min-w-0 flex-1">
      <Label htmlFor={id} className="block cursor-pointer truncate text-sm font-medium">
        {title} <span className="text-muted-foreground text-xs">({records})</span>
      </Label>
      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{description}</p>
    </div>
  </div>
);

export const DownloadDialog = <TData extends Record<string, unknown>>({
  isOpen,
  onClose,
  data,
  currentPage,
  itemsPerPage,
  columns,
  visibleColumns,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: TData[];
  currentPage: number;
  itemsPerPage: number;
  columns: ColumnDef<TData>[];
  visibleColumns: string[];
}) => {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [downloadOption, setDownloadOption] = useState<"all" | "current" | "pages">("all");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const extractTextFromCell = (cellValue: unknown, row: TData, column: ColumnDef<TData>): string => {
    if (column.cell) {
      const renderedCell = column.cell(cellValue, row);
      if (React.isValidElement(renderedCell)) {
        if (renderedCell.type === "Badge") {
          return renderedCell.props.children ?? String(cellValue ?? "");
        }
        return String(renderedCell.props?.children ?? cellValue ?? "");
      }
      return String(renderedCell ?? cellValue ?? "");
    }
    return String(cellValue ?? "");
  };

  const convertToCSV = useCallback((exportData: TData[], exportColumns: ColumnDef<TData>[]): string => {
    const headers = exportColumns.map((col) => col.header);
    const csvRows = [
      headers.join(","),
      ...exportData.map((row) =>
        exportColumns
          .map((col) => {
            const value = row[col.accessorKey];
            const cellText = extractTextFromCell(value, row, col);
            return `"${String(cellText).replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ];
    return csvRows.join("\n");
  }, []);

  const downloadCSV = useCallback((content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const downloadExcel = useCallback(
    (exportData: TData[], exportColumns: ColumnDef<TData>[], filename: string): void => {
      const headers = exportColumns.map((col) => col.header);
      const dataRows = exportData.map((row) =>
        exportColumns.map((col) => extractTextFromCell(row[col.accessorKey], row, col)),
      );
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.write_file(workbook, `${filename}.xlsx`);
    },
    [],
  );

  const generatePDF = useCallback((exportData: TData[], exportColumns: ColumnDef<TData>[], filename: string): void => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const colWidth = maxWidth / exportColumns.length;

    let yPosition = 20;
    const lineHeight = 6;
    const maxTextWidth = colWidth - 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    exportColumns.forEach((col, index) => {
      const xPosition = margin + index * colWidth + colWidth / 2;
      const headerText = doc.splitTextToSize(col.header, maxTextWidth);
      doc.text(headerText, xPosition, yPosition, { align: "center" });
    });
    yPosition += lineHeight + 2;
    doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    exportData.forEach((row) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
        exportColumns.forEach((col, index) => {
          const xPosition = margin + index * colWidth + colWidth / 2;
          const headerText = doc.splitTextToSize(col.header, maxTextWidth);
          doc.setFont("helvetica", "bold");
          doc.text(headerText, xPosition, yPosition, { align: "center" });
        });
        yPosition += lineHeight + 2;
        doc.setFont("helvetica", "normal");
        doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
      }

      exportColumns.forEach((col, colIndex) => {
        const xPosition = margin + colIndex * colWidth + colWidth / 2;
        const cellValue = row[col.accessorKey];
        const displayText = extractTextFromCell(cellValue, row, col);
        const textLines = doc.splitTextToSize(String(displayText), maxTextWidth);
        doc.text(textLines, xPosition, yPosition, { align: "center" });
      });
      yPosition += lineHeight;
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const footerText = `Generated on ${new Date().toLocaleDateString()} | Total Records: ${exportData.length}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`${filename}.pdf`);
  }, []);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      let dataToExport: TData[] = data;
      let filename = `report-${new Date().toISOString().split("T")[0]}`;

      if (downloadOption === "pages") {
        dataToExport = data.filter((_, index) => {
          const pageIndex = Math.floor(index / itemsPerPage);
          return selectedPages.has(pageIndex + 1);
        });
        filename += `-pages-${Array.from(selectedPages).join(",")}`;
      } else if (downloadOption === "current") {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        dataToExport = data.slice(startIndex, endIndex);
        filename += `-page-${currentPage}`;
      } else {
        filename += "-complete";
      }

      const exportColumns = columns.filter((col) => visibleColumns.includes(col.id));

      switch (selectedFormat) {
        case "csv": {
          const csvContent = convertToCSV(dataToExport, exportColumns);
          downloadCSV(csvContent, `${filename}.csv`);
          break;
        }
        case "excel":
          downloadExcel(dataToExport, exportColumns, filename);
          break;
        case "pdf":
          generatePDF(dataToExport, exportColumns, filename);
          break;
      }

      setTimeout(() => {
        onClose();
        setSelectedPages(new Set());
      }, 500);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [
    isDownloading,
    downloadOption,
    selectedPages,
    currentPage,
    itemsPerPage,
    data,
    selectedFormat,
    columns,
    visibleColumns,
    convertToCSV,
    downloadCSV,
    downloadExcel,
    generatePDF,
    onClose,
  ]);

  const handlePageSelect = useCallback(
    (page: number, checked: boolean) => {
      const newSelectedPages = new Set(selectedPages);
      if (checked) {
        newSelectedPages.add(page);
      } else {
        newSelectedPages.delete(page);
      }
      setSelectedPages(newSelectedPages);
    },
    [selectedPages],
  );

  const handleDownloadOptionChange = useCallback((option: "all" | "current" | "pages") => {
    setDownloadOption(option);
    if (option !== "pages") {
      setSelectedPages(new Set());
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-sm sm:max-h-[85vh] sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-base sm:text-lg">Download Report</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Choose format and data range for download
          </DialogDescription>
        </DialogHeader>

        <div className="overflow Y-scroll max-h-[calc(90vh-160px)] space-y-4 py-2 sm:space-y-6 sm:py-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium sm:text-sm">Format</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <FormatButton
                format="csv"
                Icon={FileText}
                label="CSV"
                description="Comma-separated values"
                selected={selectedFormat === "csv"}
                onClick={() => setSelectedFormat("csv")}
                isDownloading={isDownloading}
              />
              <FormatButton
                format="excel"
                Icon={FileSpreadsheet}
                label="Excel"
                description="XLSX Spreadsheet"
                selected={selectedFormat === "excel"}
                onClick={() => setSelectedFormat("excel")}
                isDownloading={isDownloading}
              />
              <FormatButton
                format="pdf"
                Icon={File}
                label="PDF"
                description="Document format"
                selected={selectedFormat === "pdf"}
                onClick={() => setSelectedFormat("pdf")}
                isDownloading={isDownloading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium sm:text-sm">Download Option</Label>
            <div className="space-y-2">
              <DownloadOptionCard
                id="all"
                checked={downloadOption === "all"}
                onChange={() => handleDownloadOptionChange("all")}
                title={`All Data (${data.length.toLocaleString()} records)`}
                description="Download the complete dataset"
                records={data.length}
                isDownloading={isDownloading}
              />
              <DownloadOptionCard
                id="current"
                checked={downloadOption === "current"}
                onChange={() => handleDownloadOptionChange("current")}
                title={`Current Page (${Math.min(itemsPerPage, data.length)} records)`}
                description="Download only the currently visible page"
                records={Math.min(itemsPerPage, data.length)}
                isDownloading={isDownloading}
              />
              <DownloadOptionCard
                id="pages"
                checked={downloadOption === "pages"}
                onChange={() => handleDownloadOptionChange("pages")}
                title={`Selected Pages (${selectedPages.size} of ${totalPages} pages)`}
                description="Choose specific pages to download"
                records={`${selectedPages.size} of ${totalPages}`}
                isDownloading={isDownloading}
              />
            </div>
          </div>

          {downloadOption === "pages" && (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label className="text-xs font-medium sm:text-sm">Select Pages</Label>
                <div className="text-muted-foreground text-center text-xs sm:text-left sm:text-sm">
                  {selectedPages.size} page{selectedPages.size !== 1 ? "s" : ""} selected
                </div>
              </div>

              <ScrollArea className="h-[160px] rounded-md border p-2 sm:h-[180px] sm:p-3 md:h-[200px]">
                <div
                  className={`grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-1.5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8`}
                >
                  {pages.slice(0, 48).map((page) => (
                    <div
                      key={`page-checkbox-${page}`}
                      className="hover:bg-muted/50 flex cursor-pointer items-center space-x-1.5 rounded p-1.5 transition-colors sm:space-x-2"
                      onClick={() => handlePageSelect(page, !selectedPages.has(page))}
                    >
                      <Checkbox
                        id={`page-${page}`}
                        checked={selectedPages.has(page)}
                        onCheckedChange={(checked) => handlePageSelect(page, !!checked)}
                        className="h-3.5 w-3.5 flex-shrink-0"
                      />
                      <Label htmlFor={`page-${page}`} className="cursor-pointer text-xs font-medium whitespace-nowrap">
                        P{page}
                      </Label>
                    </div>
                  ))}
                  {totalPages > 48 && (
                    <div className="text-muted-foreground border-muted/50 col-span-full border-t py-2.5 text-center text-xs">
                      ... and {totalPages - 48} more pages
                    </div>
                  )}
                </div>
              </ScrollArea>

              {selectedPages.size === 0 && (
                <div className="py-2 text-center">
                  <p className="text-muted-foreground text-xs">Select at least one page to download</p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/50 gap-2 border-t pt-3 sm:gap-3 sm:pt-4">
          <div className="flex w-full gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDownloading}
              className="h-10 flex-1 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading || (downloadOption === "pages" && selectedPages.size === 0)}
              className={`flex h-10 flex-1 items-center gap-2 text-sm ${isDownloading ? "bg-primary" : ""} `}
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="sr-only sm:not-sr-only">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download {selectedFormat.toUpperCase()}</span>
                  <span className="sm:hidden">{selectedFormat.toUpperCase()}</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
