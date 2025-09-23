import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const ResponsiveHeader: React.FC<{
  title: string;
  icon: React.ReactNode;
  totalRecords: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  rightActions: React.ReactNode;
}> = ({ title, icon, totalRecords, searchTerm, onSearchChange, rightActions }) => (
  <Card className="w-full p-8">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="bg-primary/10 flex-shrink-0 rounded-md p-1.5 sm:rounded-lg sm:p-2">{icon}</div>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-base font-medium sm:text-lg lg:text-xl">{title}</CardTitle>
          <p className="text-muted-foreground truncate text-xs sm:text-sm">
            Manage {totalRecords.toLocaleString()} records
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:w-auto lg:flex-initial">
        <div className="w-full min-w-0 flex-1 lg:w-64">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 transform sm:left-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full pl-8 text-sm sm:h-10 sm:pl-10"
            />
          </div>
        </div>
        <div>{rightActions}</div>
      </div>
    </div>
  </Card>
);
