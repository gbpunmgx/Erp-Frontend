"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface EmployeeStatsProps {
  total: number;
}

export default function EmployeeStats({ total }: EmployeeStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-1">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
