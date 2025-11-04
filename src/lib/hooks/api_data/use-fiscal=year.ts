import fiscalYearService from "@/app/(main)/features/fiscalYear/services/fiscal-year-service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FiscalYear } from "@/app/(main)/features/fiscalYear/types/fiscal-year"; // adjust import path if needed

export function useFiscalYear() {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiscalYears = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fiscalYearService.getAll();
      setFiscalYears(data);
    } catch {
      toast.error("Failed to fetch fiscal years. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiscalYears();
  }, [fetchFiscalYears]);

  return { fiscalYears, loading, setFiscalYears, fetchFiscalYears };
}
