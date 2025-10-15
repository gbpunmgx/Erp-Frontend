"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/core/store";

export default function DashboardHeader() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="p-4 text-gray-800 dark:text-gray-100">
      {user ? <p>Welcome, {user.username}</p> : <p>Please log in</p>}
    </div>
  );
}
