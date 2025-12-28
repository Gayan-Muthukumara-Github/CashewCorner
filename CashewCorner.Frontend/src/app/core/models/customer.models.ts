export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  type: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: string;
}

export interface CustomerResponse {
  customerId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
