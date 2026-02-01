export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type?: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdvancedSearchParams {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  type?: string;
}

export interface SalesOrderItemResponse {
  salesOrderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrderResponse {
  salesOrderId: number;
  soNumber: string;
  customerId: number;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalAmount: number;
  items: SalesOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusResponse {
  salesOrderId: number;
  soNumber: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalAmount: number;
  itemCount: number;
}
