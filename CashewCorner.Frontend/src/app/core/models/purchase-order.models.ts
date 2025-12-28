export interface PurchaseOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  orderDate: string;
  expectedDate: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemResponse {
  purchaseOrderItemId: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  receivedQuantity: number;
}

export interface PurchaseOrderResponse {
  purchaseOrderId: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: string;
  totalAmount: number;
  items: PurchaseOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
