"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/common/TabletCommon";
import { useDepartment } from "@/lib/hooks/api_data/use-department";
import { Building2Icon } from "lucide-react";
import { useEffect } from "react";
import { departmentColumns } from "./components/department-columns";
import { Department } from "./types/department";

export default function DepartmentList() {
  const { departments, loading, fetchDepartments } = useDepartment();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (loading) {
    return <p>Loading departments...</p>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Department Management"
        description="Manage departments and their details"
        icon={Building2Icon}
        showActionButton={false}
      />
      <div className="overflow-x-auto">
        <DataTable<Department> data={departments} columns={departmentColumns} />
      </div>
    </PageContainer>
  );
}
