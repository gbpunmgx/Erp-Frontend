export interface BusinessTypeBase {
  name: string;
  description: string;
}

export interface BusinessTypeWithId extends BusinessTypeBase {
  id: number;
}

export interface BusinessTypeOptionalId extends BusinessTypeBase {
  id?: number | null;
}
