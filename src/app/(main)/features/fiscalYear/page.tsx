"use client";

import { PageContainer } from "@/components/common/page-container";
import { DataTable } from "@/components/common/TabletCommon";
import { useFiscalYear } from "@/lib/hooks/api_data/use-fiscal=year";
import { CalendarCogIcon } from "lucide-react";
import { useEffect } from "react";
import { fiscalYearColumns } from "./fiscal-year-columns";
import { FiscalYear } from "./types/fiscal-year";
import { PageHeader } from "@/components/common/page-header";

export default function FiscalYearList() {
  const { fiscalYears, loading, fetchFiscalYears } = useFiscalYear();

  useEffect(() => {
    fetchFiscalYears();
  }, [fetchFiscalYears]);

  if (loading) {
    return <p>Loading fiscal years...</p>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="FIscal Year Management"
        description="Manage fiscal years and their information"
        icon={CalendarCogIcon}
        showActionButton={false}
      />
      <div className="overflow-x-auto">
        <DataTable<FiscalYear> data={fiscalYears} columns={fiscalYearColumns} />
      </div>
    </PageContainer>
  );
}
