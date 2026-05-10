export interface CreateSupplierRequest {
  name: string;
  address?: string;
  cashewTypeId?: number;
  distance?: number;
}

export interface UpdateSupplierRequest {
  name?: string;
  address?: string;
  cashewTypeId?: number;
  distance?: number;
}

export interface SupplierResponse {
  supplierId: number;
  name: string;
  address?: string;
  cashewTypeId?: number;
  cashewTypeName?: string;
  distance?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierRankingResponse {
  supplierId: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  averageUnitPrice: number;
  totalOrders: number;
  completedOrders: number;
  reliabilityScore: number;
  totalPurchaseAmount: number;
  rank: number;
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

export interface PurchaseOrderItemResponse {
  purchaseOrderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdvancedSupplierSearchParams {
  // Text filters (partial match)
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  paymentTerms?: string;
  quality?: string;
  season?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  performances?: string;
  // ID and boolean filters (exact match)
  cashewTypeId?: number;
  isApproved?: boolean;
  // Range filters for numeric fields
  minQuantity?: number;
  maxQuantity?: number;
  minCostPerUnit?: number;
  maxCostPerUnit?: number;
  minDistance?: number;
  maxDistance?: number;
  minDeliveryCost?: number;
  maxDeliveryCost?: number;
  minTimeTakenToReceive?: number;
  maxTimeTakenToReceive?: number;
  minAverageCostPerUnit?: number;
  maxAverageCostPerUnit?: number;
  minAverageDeliveryTime?: number;
  maxAverageDeliveryTime?: number;
  minAverageDeliveryCost?: number;
  maxAverageDeliveryCost?: number;
}
