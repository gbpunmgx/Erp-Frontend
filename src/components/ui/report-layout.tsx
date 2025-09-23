// "use client";
// import React, { useState, useMemo, useCallback } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   ArrowUpDown,
//   Download,
//   FileText,
//   FileSpreadsheet,
//   File,
//   Filter,
//   Columns,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { jsPDF } from 'jspdf';
//
// // Type Definitions
// export interface ColumnDef<TData = any> {
//   id: string;
//   accessorKey: keyof TData;
//   header: string;
//   cell?: (value: any, row: TData) => React.ReactNode;
//   filterable?: boolean;
//   sortable?: boolean;
//   visible?: boolean;
//   options?: { value: string; label: string }[];
// }
//
// interface GenericTableProps<TData = any> {
//   data: TData[];
//   columns: ColumnDef<TData>[];
//   onSort?: (key: keyof TData) => void;
//   loading?: boolean;
//   onEdit?: (row: TData) => void;
//   onDelete?: (row: TData) => void;
//   searchTerm: string;
//   onSearchChange: (term: string) => void;
// }
//
// export interface FormProps<TData = any> {
//   item?: TData;
//   onSubmit: (data: any) => void;
//   onClose: () => void;
// }
//
// // Helper function to extract text from React components for export
// const extractTextFromCell = (cellValue: any, row: any, column: ColumnDef): string => {
//   if (column.cell) {
//     const renderedCell = column.cell(cellValue, row);
//     if (React.isValidElement(renderedCell)) {
//       if (renderedCell.type === Badge) {
//         return renderedCell.props.children || String(cellValue || '');
//       }
//       return String(renderedCell.props?.children || cellValue || '');
//     }
//     return String(renderedCell || cellValue || '');
//   }
//   return String(cellValue || '');
// };
//
// // Download Dialog
// export const DownloadDialog: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   data: any[];
//   currentPage: number;
//   itemsPerPage: number;
//   columns: ColumnDef[];
//   visibleColumns: string[];
// }> = ({ isOpen, onClose, data, currentPage, itemsPerPage, columns, visibleColumns }) => {
//   const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv");
//   const [downloadOption, setDownloadOption] = useState<"all" | "current" | "pages">("all");
//   const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
//   const [isDownloading, setIsDownloading] = useState(false);
//
//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//
//   const convertToCSV = useCallback((exportData: any[], exportColumns: ColumnDef[]): string => {
//     const headers = exportColumns.map(col => col.header);
//     const csvRows = [
//       headers.join(','),
//       ...exportData.map(row =>
//         exportColumns.map(col => {
//           const value = row[col.accessorKey];
//           const cellText = extractTextFromCell(value, row, col);
//           return `"${String(cellText).replace(/"/g, '""')}"`;
//         }).join(',')
//       )
//     ];
//     return csvRows.join('\n');
//   }, []);
//
//   const downloadCSV = useCallback((content: string, filename: string): void => {
//     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }, []);
//
//   const downloadExcel = useCallback((exportData: any[], exportColumns: ColumnDef[], filename: string): void => {
//     const csvContent = convertToCSV(exportData, exportColumns);
//     const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }, [convertToCSV]);
//
//   const generatePDF = useCallback((exportData: any[], exportColumns: ColumnDef[], filename: string): void => {
//     const doc = new jsPDF('landscape');
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const margin = 10;
//     const maxWidth = pageWidth - (margin * 2);
//     const colWidth = maxWidth / exportColumns.length;
//
//     let yPosition = 20;
//     const lineHeight = 6;
//     const maxTextWidth = colWidth - 2;
//
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(16);
//     doc.text('Report', pageWidth / 2, 15, { align: 'center' });
//
//     doc.setFontSize(10);
//     exportColumns.forEach((col, index) => {
//       const xPosition = margin + (index * colWidth) + (colWidth / 2);
//       const headerText = doc.splitTextToSize(col.header, maxTextWidth);
//       doc.text(headerText, xPosition, yPosition, { align: 'center' });
//     });
//     yPosition += lineHeight + 2;
//     doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
//
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8);
//
//     exportData.forEach((row) => {
//       if (yPosition > pageHeight - 30) {
//         doc.addPage();
//         yPosition = 20;
//         exportColumns.forEach((col, index) => {
//           const xPosition = margin + (index * colWidth) + (colWidth / 2);
//           const headerText = doc.splitTextToSize(col.header, maxTextWidth);
//           doc.setFont("helvetica", "bold");
//           doc.text(headerText, xPosition, yPosition, { align: 'center' });
//         });
//         yPosition += lineHeight + 2;
//         doc.setFont("helvetica", "normal");
//         doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
//       }
//
//       exportColumns.forEach((col, colIndex) => {
//         const xPosition = margin + (colIndex * colWidth) + (colWidth / 2);
//         const cellValue = row[col.accessorKey];
//         const displayText = extractTextFromCell(cellValue, row, col);
//         const textLines = doc.splitTextToSize(String(displayText), maxTextWidth);
//         doc.text(textLines, xPosition, yPosition, { align: 'center' });
//       });
//       yPosition += lineHeight;
//     });
//
//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(8);
//     const footerText = `Generated on ${new Date().toLocaleDateString()} | Total Records: ${exportData.length}`;
//     doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
//
//     doc.save(`${filename}.pdf`);
//   }, []);
//
//   const handleDownload = useCallback(async () => {
//     if (isDownloading) return;
//
//     setIsDownloading(true);
//
//     try {
//       let dataToExport = data;
//       let filename = `report-${new Date().toISOString().split('T')[0]}`;
//
//       if (downloadOption === "pages") {
//         dataToExport = data.filter((_, index) => {
//           const pageIndex = Math.floor(index / itemsPerPage);
//           return selectedPages.has(pageIndex + 1);
//         });
//         filename += `-pages-${Array.from(selectedPages).join(',')}`;
//       } else if (downloadOption === "current") {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         dataToExport = data.slice(startIndex, endIndex);
//         filename += `-page-${currentPage}`;
//       } else {
//         filename += '-complete';
//       }
//
//       const exportColumns = columns.filter(col => visibleColumns.includes(col.id));
//
//       switch (selectedFormat) {
//         case "csv":
//           const csvContent = convertToCSV(dataToExport, exportColumns);
//           downloadCSV(csvContent, `${filename}.csv`);
//           break;
//         case "excel":
//           downloadExcel(dataToExport, exportColumns, `${filename}.xlsx`);
//           break;
//         case "pdf":
//           generatePDF(dataToExport, exportColumns, filename);
//           break;
//       }
//
//       setTimeout(() => {
//         onClose();
//         setSelectedPages(new Set());
//       }, 500);
//
//     } catch (error) {
//       console.error('Download failed:', error);
//       alert('Download failed. Please try again.');
//     } finally {
//       setIsDownloading(false);
//     }
//   }, [
//     isDownloading, downloadOption, selectedPages, currentPage, itemsPerPage,
//     data, selectedFormat, columns, visibleColumns, convertToCSV,
//     downloadCSV, downloadExcel, generatePDF, onClose
//   ]);
//
//   const handlePageSelect = useCallback((page: number, checked: boolean) => {
//     const newSelectedPages = new Set(selectedPages);
//     if (checked) {
//       newSelectedPages.add(page);
//     } else {
//       newSelectedPages.delete(page);
//     }
//     setSelectedPages(newSelectedPages);
//   }, [selectedPages]);
//
//   const handleDownloadOptionChange = useCallback((option: "all" | "current" | "pages") => {
//     setDownloadOption(option);
//     if (option !== "pages") {
//       setSelectedPages(new Set());
//     }
//   }, []);
//
//   const FormatButton = ({
//                           format,
//                           Icon,
//                           label,
//                           description,
//                           selected
//                         }: {
//     format: "csv" | "excel" | "pdf";
//     Icon: React.ComponentType<{ className?: string }>;
//     label: string;
//     description: string;
//     selected: boolean;
//   }) => (
//     <Button
//       variant={selected ? "default" : "outline"}
//       onClick={() => setSelectedFormat(format)}
//       className={`
//         flex items-start sm:items-center justify-start gap-2 h-12 sm:h-auto p-3
//         ${selected ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent hover:text-accent-foreground'}
//         transition-all duration-200 w-full
//       `}
//       disabled={isDownloading}
//     >
//       <Icon className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
//       <div className="text-left flex-1 min-w-0">
//         <div className="font-medium text-xs sm:text-sm truncate">{label}</div>
//         <div className="text-xs text-muted-foreground truncate hidden sm:block">{description}</div>
//       </div>
//     </Button>
//   );
//
//   const DownloadOptionCard = ({
//                                 id,
//                                 checked,
//                                 onChange,
//                                 title,
//                                 description,
//                                 records
//                               }: {
//     id: string;
//     checked: boolean;
//     onChange: () => void;
//     title: string;
//     description: string;
//     records: number | string;
//   }) => (
//     <div
//       className={`
//         flex items-start space-x-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200
//         ${checked ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:bg-muted/50'}
//       `}
//       onClick={onChange}
//     >
//       <Checkbox
//         id={id}
//         checked={checked}
//         onCheckedChange={onChange}
//         className="mt-0.5 flex-shrink-0 h-4 w-4"
//         disabled={isDownloading}
//       />
//       <div className="flex-1 min-w-0">
//         <Label
//           htmlFor={id}
//           className="text-sm font-medium cursor-pointer block truncate"
//         >
//           {title} <span className="text-xs text-muted-foreground">({records})</span>
//         </Label>
//         <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
//
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] sm:max-h-[85vh]">
//         <DialogHeader className="pb-3 sm:pb-4">
//           <DialogTitle className="text-base sm:text-lg">Download Report</DialogTitle>
//           <DialogDescription className="text-xs sm:text-sm">
//             Choose format and data range for download
//           </DialogDescription>
//         </DialogHeader>
//
//         <div className="space-y-4 sm:space-y-6 py-2 sm:py-4 max-h-[calc(90vh-160px)] overflow-y-scroll">
//           <div className="space-y-1">
//             <Label className="text-xs sm:text-sm font-medium">Format</Label>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//               <FormatButton
//                 format="csv"
//                 Icon={FileText}
//                 label="CSV"
//                 description="Comma-separated values"
//                 selected={selectedFormat === "csv"}
//               />
//               <FormatButton
//                 format="excel"
//                 Icon={FileSpreadsheet}
//                 label="Excel"
//                 description="XLSX Spreadsheet"
//                 selected={selectedFormat === "excel"}
//               />
//               <FormatButton
//                 format="pdf"
//                 Icon={File}
//                 label="PDF"
//                 description="Document format"
//                 selected={selectedFormat === "pdf"}
//               />
//             </div>
//           </div>
//
//           <div className="space-y-2">
//             <Label className="text-xs sm:text-sm font-medium">Download Option</Label>
//             <div className="space-y-2">
//               <DownloadOptionCard
//                 id="all"
//                 checked={downloadOption === "all"}
//                 onChange={() => handleDownloadOptionChange("all")}
//                 title={`All Data (${data.length.toLocaleString()} records)`}
//                 description="Download the complete dataset"
//                 records={data.length}
//               />
//               <DownloadOptionCard
//                 id="current"
//                 checked={downloadOption === "current"}
//                 onChange={() => handleDownloadOptionChange("current")}
//                 title={`Current Page (${Math.min(itemsPerPage, data.length)} records)`}
//                 description="Download only the currently visible page"
//                 records={Math.min(itemsPerPage, data.length)}
//               />
//               <DownloadOptionCard
//                 id="pages"
//                 checked={downloadOption === "pages"}
//                 onChange={() => handleDownloadOptionChange("pages")}
//                 title={`Selected Pages (${selectedPages.size} of ${totalPages} pages)`}
//                 description="Choose specific pages to download"
//                 records={`${selectedPages.size} of ${totalPages}`}
//               />
//             </div>
//           </div>
//
//           {downloadOption === "pages" && (
//             <div className="space-y-3">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                 <Label className="text-xs sm:text-sm font-medium">Select Pages</Label>
//                 <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
//                   {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
//                 </div>
//               </div>
//
//               <ScrollArea className="h-[160px] sm:h-[180px] md:h-[200px] rounded-md border p-2 sm:p-3">
//                 <div className={`
//                   grid gap-1 sm:gap-1.5
//                   grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8
//                 `}>
//                   {pages.slice(0, 48).map((page) => (
//                     <div
//                       key={`page-checkbox-${page}`}
//                       className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
//                       onClick={() => handlePageSelect(page, !selectedPages.has(page))}
//                     >
//                       <Checkbox
//                         id={`page-${page}`}
//                         checked={selectedPages.has(page)}
//                         onCheckedChange={(checked) => handlePageSelect(page, !!checked)}
//                         className="h-3.5 w-3.5 flex-shrink-0"
//                       />
//                       <Label
//                         htmlFor={`page-${page}`}
//                         className="text-xs font-medium cursor-pointer whitespace-nowrap"
//                       >
//                         P{page}
//                       </Label>
//                     </div>
//                   ))}
//                   {totalPages > 48 && (
//                     <div className="col-span-full text-center py-2.5 text-xs text-muted-foreground border-t border-muted/50">
//                       ... and {totalPages - 48} more pages
//                     </div>
//                   )}
//                 </div>
//               </ScrollArea>
//
//               {selectedPages.size === 0 && (
//                 <div className="text-center py-2">
//                   <p className="text-xs text-muted-foreground">
//                     Select at least one page to download
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//
//         <DialogFooter className="gap-2 sm:gap-3 pt-3 sm:pt-4 border-t bg-muted/50">
//           <div className="flex w-full gap-2 sm:gap-3 " >
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={isDownloading}
//               className="flex-1 h-10 text-sm"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleDownload}
//               disabled={
//                 isDownloading ||
//                 (downloadOption === "pages" && selectedPages.size === 0)
//               }
//               className={`
//                 flex items-center gap-2 flex-1 h-10 text-sm
//                 ${isDownloading ? 'bg-primary' : ''}
//               `}
//             >
//               {isDownloading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span className="sr-only sm:not-sr-only">Downloading...</span>
//                 </>
//               ) : (
//                 <>
//                   <Download className="h-4 w-4" />
//                   <span className="hidden sm:inline">Download {selectedFormat.toUpperCase()}</span>
//                   <span className="sm:hidden">{selectedFormat.toUpperCase()}</span>
//                 </>
//               )}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
//
// // Responsive Container Component
// export const ResponsiveContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
//                                                                                                    children,
//                                                                                                    className = ""
//                                                                                                  }) => (
//   <div className={`w-full mx-auto px-2 sm:px-4 lg:px-8 h-full ${className}`}>
//     {children}
//   </div>
// );
//
// // Responsive Header
// export const ResponsiveHeader: React.FC<{
//   title: string;
//   icon: React.ReactNode;
//   totalRecords: number;
//   searchTerm: string;
//   onSearchChange: (term: string) => void;
//   rightActions: React.ReactNode;
// }> = ({ title, icon, totalRecords, searchTerm, onSearchChange, rightActions }) => (
//   <Card className="w-full">
//     <CardHeader className="p-3 sm:p-4 lg:p-6 border-b">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
//         <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//           <div className="p-1.5 sm:p-2 bg-primary/10 rounded-md sm:rounded-lg flex-shrink-0">
//             {icon}
//           </div>
//           <div className="flex-1 min-w-0">
//             <CardTitle className="text-base sm:text-lg lg:text-xl truncate font-medium">{title}</CardTitle>
//             <p className="text-xs sm:text-sm text-muted-foreground truncate">
//               Manage {totalRecords.toLocaleString()} records
//             </p>
//           </div>
//         </div>
//
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto lg:flex-initial">
//           <div className="flex-1 min-w-0 w-full lg:w-64">
//             <div className="relative">
//               <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground pointer-events-none" />
//               <Input
//                 placeholder="Search records..."
//                 value={searchTerm}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="pl-8 sm:pl-10 w-full h-9 sm:h-10 text-sm"
//               />
//             </div>
//           </div>
//
//           <div className="flex items-center gap-1 sm:gap-2 flex-nowrap overflow-x-auto pb-0.5 sm:pb-1 lg:pb-0 min-w-0">
//             <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0">
//               {rightActions}
//             </div>
//           </div>
//         </div>
//       </div>
//     </CardHeader>
//   </Card>
// );
//
// // Responsive Stats Grid
// export const ResponsiveStatsGrid: React.FC<{
//   stats: Array<{ label: string; value: number; color?: string }>;
// }> = ({ stats }) => (
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
//     {stats.map((stat, index) => (
//       <Card key={`stat-${index}`} className="w-full">
//         <CardContent className="p-3 sm:p-4">
//           <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color || 'text-foreground'}`}>
//             {stat.value.toLocaleString()}
//           </div>
//           <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
//             {stat.label}
//           </p>
//         </CardContent>
//       </Card>
//     ))}
//   </div>
// );
//
// // Responsive Table Container
// export const ResponsiveTableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div className="w-full">
//     <div>
//       <CardContent className="p-0 h-full">
//         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 relative" style={{ minWidth: 0 }}>
//           <div className="inline-block min-w-full">
//             {children}
//           </div>
//         </div>
//       </CardContent>
//     </div>
//   </div>
// );
//
// // Responsive Pagination
// export const ResponsivePagination: React.FC<{
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   itemsPerPage: number;
//   totalItems: number;
//   loading?: boolean;
//   onItemsPerPageChange?: (value: string) => void;
// }> = ({
//         currentPage,
//         totalPages,
//         onPageChange,
//         itemsPerPage,
//         totalItems,
//         loading = false,
//         onItemsPerPageChange
//       }) => {
//   const [pageInput, setPageInput] = useState(currentPage.toString());
//
//   const getVisiblePages = useCallback((): (number | string)[] => {
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
//
//     const delta = 1;
//     const rangeWithDots: (number | string)[] = [1];
//     const l = Math.max(2, currentPage - delta);
//     const r = Math.min(totalPages - 1, currentPage + delta);
//
//     for (let i = l; i <= r; i++) {
//       rangeWithDots.push(i);
//     }
//
//     if (r < totalPages - 1) {
//       rangeWithDots.push('...');
//     }
//     rangeWithDots.push(totalPages);
//     return rangeWithDots;
//   }, [currentPage, totalPages]);
//
//   const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setPageInput(value);
//   };
//
//   const handlePageInputSubmit = () => {
//     const pageNum = parseInt(pageInput);
//     if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
//       onPageChange(pageNum);
//       setPageInput(pageNum.toString());
//     } else {
//       setPageInput(currentPage.toString());
//     }
//   };
//
//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handlePageInputSubmit();
//     }
//   };
//
//   // Update input when currentPage changes
//   React.useEffect(() => {
//     setPageInput(currentPage.toString());
//   }, [currentPage]);
//
//   if (loading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-2 sm:p-3">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
//             <Skeleton className="h-4 w-full sm:w-48" />
//             <div className="flex items-center gap-1">
//               <Skeleton className="h-8 w-20" />
//               <Skeleton className="h-8 w-32" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }
//
//   if (totalPages === 0) return null;
//
//   return (
//     <Card className="w-full">
//       <CardContent className="p-2 sm:p-3">
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
//           <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left w-full sm:w-auto">
//             Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} results
//           </div>
//
//           <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
//             {onItemsPerPageChange && (
//               <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
//                 <SelectTrigger className="w-16 sm:w-20 h-8">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="25">25</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                   <SelectItem value="100">100</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//
//             <div className="flex items-center gap-0.5 sm:gap-1">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(1)}
//                 disabled={currentPage === 1 || totalPages === 0}
//                 className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
//               >
//                 1
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1 || totalPages === 0}
//                 className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
//               >
//                 ‹
//               </Button>
//
//               {/* Page number input */}
//               <div className="flex items-center gap-1">
//                 <Input
//                   type="number"
//                   value={pageInput}
//                   onChange={handlePageInputChange}
//                   onKeyPress={handleKeyPress}
//                   onBlur={handlePageInputSubmit}
//                   className="w-12 sm:w-14 h-7 sm:h-8 text-xs p-1 text-center"
//                   min={1}
//                   max={totalPages}
//                   disabled={totalPages === 0}
//                 />
//                 <span className="text-xs text-muted-foreground">of {totalPages}</span>
//               </div>
//
//               {getVisiblePages().map((page, index) => (
//                 <React.Fragment key={`page-fragment-${index}-${typeof page === 'string' ? page : ''}`}>
//                   {typeof page === 'string' ? (
//                     <span className="flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 text-xs text-muted-foreground">...</span>
//                   ) : (
//                     <Button
//                       key={`btn-${page}`}
//                       variant={currentPage === page ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => onPageChange(page)}
//                       disabled={totalPages === 0}
//                       className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
//                     >
//                       {page}
//                     </Button>
//                   )}
//                 </React.Fragment>
//               ))}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
//               >
//                 ›
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(totalPages)}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs"
//               >
//                 {totalPages}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
//
// // Generic Table Component
// export const GenericTable = <TData extends Record<string, unknown>>({
//                                                                       data,
//                                                                       columns,
//                                                                       onSort,
//                                                                       loading = false,
//                                                                       onEdit,
//                                                                       onDelete,
//                                                                       searchTerm,
//                                                                       onSearchChange
//                                                                     }: GenericTableProps<TData>) => {
//   const visibleColumns = columns.filter(col => col.visible !== false);
//
//   if (loading) {
//     return <TableSkeleton columns={visibleColumns.length} />;
//   }
//
//   return (
//     <ResponsiveTableContainer>
//       <div className="w-full min-w-max overflow-x-auto">
//         <Table className="table-auto w-full" style={{ tableLayout: 'auto' }}>
//           <TableHeader className="sticky top-0 bg-background z-10">
//             <TableRow>
//               {visibleColumns.map((column, colIndex) => (
//                 <TableHead
//                   key={`header-${column.id}-${colIndex}`}
//                   className={`py-2.5 sm:py-3 px-2 sm:px-3 ${column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}`}
//                   style={{
//                     whiteSpace: 'normal',
//                     wordWrap: 'break-word',
//                     minWidth: 'auto',
//                     width: 'auto'
//                   }}
//                 >
//                   {column.sortable && onSort ? (
//                     <button
//                       onClick={() => onSort!(column.accessorKey as keyof TData)}
//                       className="flex items-center gap-1 h-auto p-0 justify-start w-full text-left bg-transparent border-none cursor-pointer text-xs sm:text-sm"
//                     >
//                       <span className="font-medium text-xs sm:text-sm">{column.header}</span>
//                       <ArrowUpDown className="h-3 w-3 ml-1 flex-shrink-0" />
//                     </button>
//                   ) : (
//                     <span className="font-medium text-xs sm:text-sm">{column.header}</span>
//                   )}
//                 </TableHead>
//               ))}
//               {(onEdit || onDelete) && (
//                 <TableHead className="text-right py-2.5 sm:py-3 px-2 sm:px-3">
//                   Actions
//                 </TableHead>
//               )}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.length > 0 ? (
//               data.map((row, rowIndex) => (
//                 <TableRow key={`row-${(row as any).id || `row-${rowIndex}`}`} className="border-b hover:bg-muted/50">
//                   {visibleColumns.map((column, colIndex) => {
//                     const value = row[column.accessorKey];
//                     const displayValue = column.cell ? column.cell(value, row) : String(value || '');
//                     return (
//                       <TableCell
//                         key={`cell-${column.id}-${(row as any).id || rowIndex}-${colIndex}`}
//                         className="py-2.5 sm:py-3 px-2 sm:px-3"
//                         style={{
//                           whiteSpace: 'normal',
//                           wordWrap: 'break-word',
//                           overflowWrap: 'break-word',
//                           minWidth: 'auto',
//                           width: 'auto',
//                           maxWidth: 'none'
//                         }}
//                       >
//                         <div className="text-xs sm:text-sm" title={typeof displayValue === 'string' ? displayValue : extractTextFromCell(value, row, column)}>
//                           {displayValue}
//                         </div>
//                       </TableCell>
//                     );
//                   })}
//                   {(onEdit || onDelete) && (
//                     <TableCell className="text-right py-2.5 sm:py-3 px-2 sm:px-3">
//                       <div className="flex gap-1 justify-end">
//                         {onEdit && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => onEdit(row)}
//                             className="h-7 sm:h-8 w-7 sm:w-8 p-0"
//                           >
//                             <Edit className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
//                           </Button>
//                         )}
//                         {onDelete && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => onDelete(row)}
//                             className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
//                           </Button>
//                         )}
//                       </div>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={visibleColumns.length + (onEdit || onDelete ? 1 : 0)}
//                   className="h-20 sm:h-24 text-center py-8"
//                 >
//                   <div className="text-muted-foreground text-xs sm:text-sm">
//                     {searchTerm ? `No results matching "${searchTerm}".` : "No data found."}
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </ResponsiveTableContainer>
//   );
// };
// // Table Skeleton
// export const TableSkeleton: React.FC<{ columns: number }> = ({ columns = 20 }) => (
//   <ResponsiveTableContainer>
//     <Table className="table-layout: auto">
//       <TableHeader>
//         <TableRow>
//           {Array.from({ length: columns }).map((_, i) => (
//             <TableHead key={`skeleton-header-${i}`} className="py-2.5 sm:py-3 px-2 sm:px-3">
//               <Skeleton className="h-4 w-16 sm:w-20" />
//             </TableHead>
//           ))}
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Array.from({ length: 10 }).map((_, index) => (
//           <TableRow key={`skeleton-row-${index}`}>
//             {Array.from({ length: columns }).map((_, i) => (
//               <TableCell key={`skeleton-cell-${index}-${i}`} className="py-2.5 sm:py-3 px-2 sm:px-3">
//                 <Skeleton className="h-4 w-20 sm:w-24" />
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </ResponsiveTableContainer>
// );
// // Column Visibility Dialog
// export const ColumnVisibility: React.FC<{
//   columns: ColumnDef[];
//   currentVisibleIds: string[];
//   onVisibilityChange: (id: string, visible: boolean) => void;
//   onClose: () => void;
// }> = ({ columns, currentVisibleIds, onVisibilityChange, onClose }) => {
//   return (
//     <DialogContent className="max-w-sm sm:max-w-md w-full max-h-[80vh]">
//       <DialogHeader>
//         <DialogTitle className="text-base sm:text-lg">Column Visibility</DialogTitle>
//         <DialogDescription className="text-sm">Select columns to display</DialogDescription>
//       </DialogHeader>
//       <div className="space-y-2 max-h-60 overflow-y-auto">
//         {columns.map((column, index) => (
//           <div key={`col-vis-${column.id}-${index}`} className="flex items-center justify-between py-2.5 px-1 sm:px-2">
//             <Label className="text-xs sm:text-sm truncate flex-1 mr-2">{column.header}</Label>
//             <Checkbox
//               checked={currentVisibleIds.includes(column.id)}
//               onCheckedChange={(checked) => onVisibilityChange(column.id, !!checked)}
//               className="h-4 w-4"
//             />
//           </div>
//         ))}
//       </div>
//       <DialogFooter>
//         <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm">
//           Close
//         </Button>
//       </DialogFooter>
//     </DialogContent>
//   );
// };
//
// // Filter Popover Content
// export const FilterPopoverContent: React.FC<{
//   columns: ColumnDef[];
//   filters: Record<string, string>;
//   onFilterChange: (colId: string, value: string) => void;
// }> = ({ columns, filters, onFilterChange }) => {
//   return (
//     <div className="space-y-3 max-h-80 overflow-y-auto w-72 sm:w-80 p-3">
//       <h3 className="font-medium text-xs sm:text-sm mb-3">Column Filters</h3>
//       {columns
//         .filter(col => col.filterable && col.visible !== false)
//         .map((column, index) => (
//           <div key={`filter-${column.id}-${index}`} className="space-y-1.5">
//             <Label className="text-xs font-medium capitalize">{column.header}</Label>
//             {column.options ? (
//               <Select value={filters[column.id] || ''} onValueChange={(val) => onFilterChange(column.id, val)}>
//                 <SelectTrigger className="w-full h-9">
//                   <SelectValue placeholder={`Filter ${column.header}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="">All</SelectItem>
//                   {column.options.map((opt, optIndex) => (
//                     <SelectItem key={`opt-${opt.value}-${optIndex}`} value={opt.value}>{opt.label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <Input
//                 placeholder={`Filter ${column.header}`}
//                 value={filters[column.id] || ''}
//                 onChange={(e) => onFilterChange(column.id, e.target.value)}
//                 className="w-full h-9 text-sm"
//               />
//             )}
//           </div>
//         ))}
//       {columns.filter(col => col.filterable && col.visible !== false).length === 0 && (
//         <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
//           No filterable columns available
//         </p>
//       )}
//     </div>
//   );
// };
//
// // Generic Form Component
// export const GenericForm: React.FC<FormProps> = ({ item, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState({});
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };
//
//   return (
//     <DialogContent className="sm:max-w-md">
//       <DialogHeader>
//         <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
//         <DialogDescription>{item ? "Update the item" : "Create a new item"}</DialogDescription>
//       </DialogHeader>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">Name</Label>
//           <Input id="name" placeholder="Enter name" required className="h-9" />
//         </div>
//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={onClose} className="h-9">Cancel</Button>
//           <Button type="submit" className="h-9">{item ? "Update" : "Create"}</Button>
//         </DialogFooter>
//       </form>
//     </DialogContent>
//   );
// };
//
// // Main Generic Report Component
// interface GenericReportProps<TData = any> {
//   title: string;
//   data: TData[];
//   columns: ColumnDef<TData>[];
//   icon: React.ReactNode;
//   onSubmitAddonSubmitAdd?: (data: any) => void;
//   stats?: Array<{ label: string; value: number; color?: string }>;
//   FormComponent?: React.ComponentType<FormProps<TData>>;
// }
//
// export const GenericReport = <TData extends Record<string, unknown>>({
//                                                                        title,
//                                                                        data,
//                                                                        columns,
//                                                                        icon,
//                                                                        onSubmitAdd,
//                                                                        stats,
//                                                                        FormComponent = GenericForm
//                                                                      }: GenericReportProps<TData>) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingItem, setEditingItem] = useState<TData | null>(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDownloadOpen, setIsDownloadOpen] = useState(false);
//   const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filters, setFilters] = useState<Record<string, string>>({});
//   const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' | null }>({ key: null, direction: null });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(25);
//   const [isLoading, setIsLoading] = useState(true);
//   const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(columns.map(col => col.id));
//
//   React.useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 1000);
//     return () => clearTimeout(timer);
//   }, []);
//
//   const filteredData = useMemo(() => {
//     let filtered = data.filter((item) =>
//       columns.some(col => String(item[col.accessorKey]).toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//     Object.entries(filters).forEach(([colId, filterVal]) => {
//       const col = columns.find(c => c.id === colId);
//       if (col && filterVal) {
//         filtered = filtered.filter(item => String(item[col.accessorKey]).toLowerCase().includes(filterVal.toLowerCase()));
//       }
//     });
//     return filtered;
//   }, [data, searchTerm, filters, columns]);
//
//   const sortedData = useMemo(() => {
//     if (!sortConfig.key || !sortConfig.direction) return filteredData;
//
//     return [...filteredData].sort((a, b) => {
//       const aVal = a[sortConfig.key as keyof TData];
//       const bVal = b[sortConfig.key as keyof TData];
//       const aStr = String(aVal ?? '').toLowerCase();
//       const bStr = String(bVal ?? '').toLowerCase();
//
//       if (aStr < bStr) {
//         return sortConfig.direction === 'asc' ? -1 : 1;
//       }
//       if (aStr > bStr) {
//         return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//   }, [filteredData, sortConfig]);
//
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedData.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedData, currentPage, itemsPerPage]);
//
//   const handleSort = useCallback((key: keyof TData) => {
//     let direction: 'asc' | 'desc' = 'asc';
//     if (sortConfig.key === String(key) && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key: String(key), direction });
//     setCurrentPage(1);
//   }, [sortConfig]);
//
//   const handleFilterChange = useCallback((colId: string, value: string) => {
//     setFilters(prev => ({ ...prev, [colId]: value }));
//     setCurrentPage(1);
//   }, []);
//
//   const handleVisibilityChange = useCallback((id: string, visible: boolean) => {
//     setVisibleColumnIds(prev => {
//       const newIds = new Set(prev);
//       if (visible) {
//         newIds.add(id);
//       } else {
//         newIds.delete(id);
//       }
//       return Array.from(newIds);
//     });
//   }, []);
//
//   const visibleColumns = useMemo(() =>
//       columns.map(col => ({ ...col, visible: visibleColumnIds.includes(col.id) }))
//     , [columns, visibleColumnIds]);
//
//   const handlePageChange = useCallback((page: number) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       setCurrentPage(page);
//     }
//   }, [currentPage, totalPages]);
//
//   const handleItemsPerPageChange = useCallback((value: string) => {
//     setItemsPerPage(parseInt(value));
//     setCurrentPage(1);
//   }, []);
//
//   const handleAdd = useCallback(() => {
//     setEditingItem(null);
//     setIsAddDialogOpen(true);
//   }, []);
//
//   const handleEdit = useCallback((row: TData) => {
//     setEditingItem(row);
//     setIsAddDialogOpen(true);
//   }, []);
//
//   const handleDelete = useCallback((row: TData) => {
//     console.log('Delete', row);
//   }, []);
//
//   const handleSubmit = useCallback((formData: any) => {
//     if (onSubmitAdd) {
//       onSubmitAdd(formData);
//     }
//     setIsAddDialogOpen(false);
//     setEditingItem(null);
//   }, [onSubmitAdd]);
//
//   return (
//     <ResponsiveContainer className="min-h-[calc(100vh-64px)]">
//       <div className="space-y-4 sm:space-y-6">
//         <ResponsiveHeader
//           title={title}
//           icon={icon}
//           totalRecords={data.length}
//           searchTerm={searchTerm}
//           onSearchChange={setSearchTerm}
//           rightActions={
//             <div className="flex items-center gap-1 sm:gap-2">
//               <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm">
//                     <Filter className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
//                     Filters
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="end">
//                   <FilterPopoverContent
//                     columns={visibleColumns}
//                     filters={filters}
//                     onFilterChange={handleFilterChange}
//                   />
//                 </PopoverContent>
//               </Popover>
//
//               <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm">
//                     <Columns className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
//                     Columns
//                   </Button>
//                 </DialogTrigger>
//                 <ColumnVisibility
//                   columns={columns}
//                   currentVisibleIds={visibleColumnIds}
//                   onVisibilityChange={handleVisibilityChange}
//                   onClose={() => setIsColumnDialogOpen(false)}
//                 />
//               </Dialog>
//
//               <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm">
//                     <Download className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
//                     Export
//                   </Button>
//                 </DialogTrigger>
//                 <DownloadDialog
//                   isOpen={isDownloadOpen}
//                   onClose={() => setIsDownloadOpen(false)}
//                   data={sortedData}
//                   currentPage={currentPage}
//                   itemsPerPage={itemsPerPage}
//                   columns={visibleColumns}
//                   visibleColumns={visibleColumnIds}
//                 />
//               </Dialog>
//
//               {onSubmitAdd && (
//                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button size="sm" className="h-9 sm:h-10 whitespace-nowrap text-xs sm:text-sm" onClick={handleAdd}>
//                       <Plus className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
//                       Add
//                     </Button>
//                   </DialogTrigger>
//                   <FormComponent
//                     item={editingItem || undefined}
//                     onSubmit={handleSubmit}
//                     onClose={() => setIsAddDialogOpen(false)}
//                   />
//                 </Dialog>
//               )}
//             </div>
//           }
//         />
//
//         <div className="min-h-[calc(100vh-200px)]">
//           <GenericTable
//             data={paginatedData}
//             columns={visibleColumns}
//             onSort={handleSort}
//             loading={isLoading}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//           />
//
//           {totalPages > 0 && (
//             <ResponsivePagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//               itemsPerPage={itemsPerPage}
//               totalItems={sortedData.length}
//               onItemsPerPageChange={handleItemsPerPageChange}
//             />
//           )}
//
//           {stats && <ResponsiveStatsGrid stats={stats} />}
//         </div>
//       </div>
//     </ResponsiveContainer>
//   );
// };