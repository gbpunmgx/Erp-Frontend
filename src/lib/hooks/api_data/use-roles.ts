import React, { useState, useEffect } from "react";
import RoleService from "@/app/(main)/features/access_control/services/role-service";
import { toast } from "sonner";
import { Role } from "@/app/(main)/features/access_control/types/role";

export const useRoles = (): {
  roles: Role[];
  loading: boolean;
  fetch: () => Promise<void>;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
} => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await RoleService.getAll(); // Ensure RoleService.getAll returns Promise<Role[]>
      setRoles(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch roles";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoles();
  }, []);

  return { roles, loading, fetch: fetchRoles, setRoles };
};
