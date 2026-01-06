export interface InventoryResponse {
  inventoryId: number;
  productId: number;
  productName: string;
  productSku: string;
  location: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  unit: string;
  lastUpdated: string;
}

export interface InventorySummaryResponse {
  totalProducts: number;
  lowStockItems: number;
  totalInventoryValue: number;
  locationsCount: number;
}

export interface ReceiveStockRequest {
  productId: number;
  quantity: number;
  location: string;
  purchaseOrderId?: number;
  notes?: string;
}

export interface AdjustStockRequest {
  productId: number;
  quantity: number;
  location: string;
  adjustmentType: 'ADD' | 'SUBTRACT';
  notes?: string;
}

export interface StockMovementResponse {
  movementId: number;
  productId: number;
  productName: string;
  movementType: string;
  relatedType: string;
  relatedId: number;
  quantity: number;
  balanceAfter: number;
  notes: string;
  movementDate: string;
}

export interface InventorySearchParams {
  variety?: string;
  supplierId?: number;
  location?: string;
  productName?: string;
}
