export interface CreateSupplierRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms?: string;
  isApproved?: boolean;
}

export interface SupplierResponse {
  supplierId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
