import { BusinessTypeWithId } from "@/app/(main)/features/organization/businessType/types/business-type";
import { AbstractEntity } from "@/core/abstract-entity";

export interface OrganizationBase {
  name: string;
  phoneNo: string;
  address: string;
  panNo?: string;
  establishDate?: string;
  active?: boolean;
  logo?: string;
  businessType: BusinessTypeWithId;
}

export interface OrganizationWithId extends OrganizationBase, AbstractEntity {
  id: number;
  code: string;
}

export interface OrganizationOptionalId extends OrganizationBase, AbstractEntity {
  id?: number | null;
  code?: string;
}
