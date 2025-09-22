"use client";
import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Role } from "@/app/(main)/features/access_control/types/role";
import { colors } from "@/utils/colors";

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-4 w-4 rounded-full ${getRandomColor()}`}></div>
            <CardTitle className="text-base">{role.name}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(role)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(role.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{role.description}</CardDescription>
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{role.featureActionIds.length} permissions</span>
          <span>{role.authUserIds.length} users</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
