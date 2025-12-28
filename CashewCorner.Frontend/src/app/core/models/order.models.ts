export interface CreateOrderRequest {
  customerId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderRequest {
  customerId?: number;
  orderDate?: string;
  status?: string;
  totalAmount?: number;
}

export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  orderId: number;
  customerId: number;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}

export interface AssignProductRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateProductQuantityRequest {
  quantity: number;
}
