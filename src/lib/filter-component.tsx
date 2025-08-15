import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { formatDate } from "./utils";

type FilterProps = {
  column: any;
  filterOptions?: { value: string; label: string }[];
};

export function FilterComponent({ column, filterOptions }: FilterProps) {
  const columnId = column.id;
  const filterValue = column.getFilterValue() as string;

  if (filterOptions) {
    return (
      <Select
        onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}
        value={filterValue ? String(filterValue) : "all"}
      >
        <SelectTrigger className="border-input bg-background/90 hover:border-primary/50 hover:bg-accent/30 focus:ring-primary/20 h-8 w-full text-xs shadow-sm transition-all duration-300 focus:ring-2">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (columnId === "establishDate") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-input bg-background/90 hover:border-primary/50 hover:bg-accent/30 focus:ring-primary/20 h-8 w-full justify-start text-left text-xs font-normal transition-all duration-300 focus:ring-2"
          >
            <CalendarIcon className="text-muted-foreground mr-2 h-3 w-3" />
            {filterValue ? formatDate(new Date(filterValue)) : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border-border/60 bg-card/95 w-auto p-0 shadow-xl backdrop-blur-md">
          <Calendar
            mode="single"
            selected={filterValue ? new Date(filterValue) : undefined}
            onSelect={(date) => column.setFilterValue(date ? formatDate(date) : undefined)}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="group relative">
      <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 transform transition-colors duration-300" />
      <Input
        placeholder="Search..."
        value={filterValue ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="border-input bg-background/90 hover:border-primary/50 hover:bg-accent/30 focus:border-primary focus:ring-primary/20 h-8 w-full pl-8 text-xs shadow-sm transition-all duration-300 focus:ring-2"
      />
    </div>
  );
}
