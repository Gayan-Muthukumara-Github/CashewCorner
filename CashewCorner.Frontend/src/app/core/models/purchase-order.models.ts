export interface PurchaseOrderItemRequest {
  cashewTypeId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  orderDate: string;
  expectedDate?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  paymentTerms?: string;
  isApproved?: boolean;
  quantity?: number;
  quality?: string;
  costPerUnit?: number;
  season?: string;
  paymentMethod?: string;
  distance?: number;
  deliveryMethod?: string;
  deliveryCost?: number;
  timeTakenToReceive?: number;
  averageCostPerUnit?: number;
  averageDeliveryTime?: number;
  averageDeliveryCost?: number;
  performances?: string;
  items: PurchaseOrderItemRequest[];
}

export interface PurchaseOrderItemResponse {
  purchaseOrderItemId: number;
  cashewTypeId: number;
  cashewTypeName: string;
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
  phone?: string;
  email?: string;
  contactPerson?: string;
  paymentTerms?: string;
  isApproved?: boolean;
  quantity?: number;
  quality?: string;
  costPerUnit?: number;
  season?: string;
  paymentMethod?: string;
  distance?: number;
  deliveryMethod?: string;
  deliveryCost?: number;
  timeTakenToReceive?: number;
  averageCostPerUnit?: number;
  averageDeliveryTime?: number;
  averageDeliveryCost?: number;
  performances?: string;
  status: string;
  totalAmount: number;
  items: PurchaseOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
