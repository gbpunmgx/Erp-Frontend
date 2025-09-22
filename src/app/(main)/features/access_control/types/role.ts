export interface Role {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  organizationId: number;
  featureActionIds: number[];
  authUserIds: number[];
}

export interface Permission {
  id: number;
  name: string;
  featureId: number;
  featureName: string;
}
