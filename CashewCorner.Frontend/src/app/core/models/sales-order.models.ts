export interface SalesOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalesOrderRequest {
  customerId: number;
  orderDate: string;
  deliveryDate: string;
  items: SalesOrderItemRequest[];
}

export interface SalesOrderItemResponse {
  salesOrderItemId: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
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
