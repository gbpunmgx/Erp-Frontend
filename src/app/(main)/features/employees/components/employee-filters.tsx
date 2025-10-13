"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid3X3, List } from "lucide-react";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  activeTab: "employee" | "leave";
  setActiveTab: (tab: "employee" | "leave") => void;
  clearFilters: () => void;
}

export default function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  clearFilters,
}: EmployeeFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-8">
        <button
          className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
            activeTab === "employee"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("employee")}
        >
          Employees
        </button>
      </div>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search employees..."
              className="w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
