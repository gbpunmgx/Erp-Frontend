import { useState, useEffect } from "react";
import FeatureActionService from "@/app/(main)/features/access_control/services/feature-action-service";
import { toast } from "sonner";
import { FeatureAction } from "@/app/(main)/features/access_control/types/eature-action";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<FeatureAction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await FeatureActionService.getAll();
      setPermissions(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch permissions";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPermissions();
  }, []);

  return { permissions, loading, fetch: fetchPermissions };
};
