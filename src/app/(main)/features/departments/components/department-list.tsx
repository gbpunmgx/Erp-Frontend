"use client";

import React from "react";
import { Department } from "../types/department";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  departments: Department[];
}

export default function DepartmentList({ departments }: Props) {
  if (!departments || departments.length === 0) {
    return <p className="text-gray-500">No departments found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {departments.map((d) => (
        <Card key={d.id}>
          <CardContent className="space-y-1 p-4">
            <h2 className="text-lg font-semibold">{d.name}</h2>
            {d.description && <p className="text-sm text-gray-600">{d.description}</p>}
            {d.location && <p className="text-xs text-gray-400">📍 {d.location}</p>}
            <p className="text-xs text-gray-400">
              Org ID: {d.organizationId}, Branch ID: {d.branchId}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
