"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserRoundCog, ChevronUp, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import InfoCard from "@/components/common/info-card";
import { ActionsCell } from "@/lib/actions-cell";
import { Pagination } from "@/components/common";

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  roles: { id: number; name: string; color: string }[];
  status: "active" | "inactive" | "pending" | boolean;
  lastActive: string;
}

interface UsersTabProps {
  users: User[];
}

type SortKey = "username" | "status" | "lastActive" | null;
type SortOrder = "asc" | "desc";

const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "inactive" | "pending">("all");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter users based on search and status
  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const matchesSearch = user.username.toLowerCase().includes(userSearchTerm.toLowerCase());
      const normalizedStatus = typeof user.status === "boolean" ? (user.status ? "active" : "inactive") : user.status;
      const matchesStatus = userStatusFilter === "all" || normalizedStatus === userStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, userSearchTerm, userStatusFilter]);

  // Sort users based on selected column
  const sortedUsers = useMemo(() => {
    if (!sortKey) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      if (sortKey === "username") {
        aValue = a.username.toLowerCase();
        bValue = b.username.toLowerCase();
      } else if (sortKey === "status") {
        aValue = typeof a.status === "boolean" ? (a.status ? "active" : "inactive") : a.status;
        bValue = typeof b.status === "boolean" ? (b.status ? "active" : "inactive") : b.status;
      } else if (sortKey === "lastActive") {
        aValue = new Date(a.lastActive).getTime();
        bValue = new Date(b.lastActive).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortKey, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = pageIndex * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, pageIndex, pageSize]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={userStatusFilter} onValueChange={(value) => setUserStatusFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <InfoCard
          title="No users found"
          message="Try adjusting your search terms or filters."
          icon={<UserRoundCog className="mx-auto mb-4 h-12 w-12" />}
        />
      ) : (
        <Card className="p-6">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("username")}>
                  User {renderSortIcon("username")}
                </TableHead>
                <TableHead className="w-[250px]">Roles</TableHead>
                <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort("status")}>
                  Status {renderSortIcon("status")}
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort("lastActive")}>
                  Last Active {renderSortIcon("lastActive")}
                </TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => {
                const normalizedStatus =
                  typeof user.status === "boolean" ? (user.status ? "active" : "inactive") : user.status;
                return (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    {/* User Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-muted-foreground truncate text-sm">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Roles */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <Badge
                            key={role.id}
                            variant="outline"
                            className="px-2 py-0.5 text-sm text-white"
                            style={{ backgroundColor: role.color }}
                          >
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={normalizedStatus === "active" ? "default" : "destructive"} className="capitalize">
                        {normalizedStatus}
                      </Badge>
                    </TableCell>

                    {/* Last Active */}
                    <TableCell className="text-muted-foreground text-sm">{user.lastActive}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <ActionsCell
                        row={user}
                        onEdit={() => console.log(user.id)}
                        onDelete={() => console.log(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <Pagination
            totalItems={filteredUsers.length}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            dataSize={`${filteredUsers.length} items`}
          />
        </Card>
      )}
    </div>
  );
};

export default UsersTab;
