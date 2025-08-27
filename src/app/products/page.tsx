"use client";

import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { OrganizationWithId } from "@/app/(main)/features/organization/all/types/organization-type";
import { DataTable } from "@/lib/data-table";
import { columns } from "@/app/(main)/features/category/types/columns";
import { Card } from "@/components/ui/card";
import SectionHeading from "@/components/ui/section-heading";
import { getContentMaxWidth } from "@/lib/layout-utils";

const organizations = Array.from({ length: 5000 }).map((_, i) => ({
  id: i + 1,
  code: `ORG-${1000 + i}`,
  name: `Organization ${i + 1}`,
  phoneNo: `9864855648${i}`,
  address: `Address ${i + 1}`,
  panNo: `PAN-${i + 1}`,
  establishDate: "2025-07-01",
  active: i % 2 === 0,
  logo: "",
  businessType: { id: 1, name: "Private", description: "Private Limited" },
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default function OrganizationPage() {
  const { state: sidebarState } = useSidebar();
  const [data, setData] = useState<OrganizationWithId[]>(organizations);

  const handleEdit = (row: OrganizationWithId) => {
    console.log("Edit:", row);
  };

  const handleDelete = (row: OrganizationWithId) => {
    setData(data.filter((item) => item.id !== row.id));
  };

  const contentWidthClass = getContentMaxWidth(sidebarState || "expanded");

  return (
    <div className={`${contentWidthClass} space-y-6`}>
      <SectionHeading title="Organization Management" />
      <Card className="p-6">
        <DataTable<OrganizationWithId>
          columns={columns}
          data={data}
          dataSize={`${data.length} items`}
          showDataSize={true}
          showActionsColumn={true}
          actionsColumnWidth="120px"
          filterOptions={{
            active: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ],
          }}
          bulkActions={{
            onBulkDelete: (rows) => console.log("Delete selected:", rows),
          }}
          actionsConfig={{
            onEdit: handleEdit,
            onDelete: handleDelete,
          }}
        />
      </Card>
    </div>
  );
}
