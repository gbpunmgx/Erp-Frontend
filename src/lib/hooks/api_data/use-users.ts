import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import UserService from "@/app/(main)/features/access_control/services/user-service";
import { User } from "@/app/(main)/features/access_control/types/user";

export function useUsers(): {
  users: User[];
  loading: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  fetchUsers: () => Promise<void>;
} {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, loading, setUsers, fetchUsers };
}
