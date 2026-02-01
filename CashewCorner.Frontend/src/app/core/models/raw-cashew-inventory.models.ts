// Raw Cashew Inventory Response DTO
export interface RawCashewInventoryResponse {
  rawCashewInventoryId: number;
  cashewTypeId: number;
  cashewType: string;
  cashewQuality: string;
  location: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdated: string;
}

// Raw Cashew Inventory Summary DTO
export interface RawCashewInventorySummaryResponse {
  totalCashewTypes: number;
  lowStockItems: number;
  totalQuantityOnHand: number;
  locationsCount: number;
}

// Receive Raw Cashew Stock Request DTO
export interface ReceiveRawCashewStockRequest {
  cashewTypeId: number;
  quantity: number;
  location?: string;
  purchaseOrderId?: number;
  notes?: string;
}

// Adjust Raw Cashew Stock Request DTO
export interface AdjustRawCashewStockRequest {
  cashewTypeId: number;
  quantity: number;
  adjustmentType: 'ADD' | 'REMOVE' | 'USAGE' | 'DAMAGE' | 'CORRECTION';
  location?: string;
  notes?: string;
}

// Raw Cashew Stock Movement Response DTO
export interface RawCashewStockMovementResponse {
  movementId: number;
  cashewTypeId: number;
  cashewType: string;
  cashewQuality: string;
  movementType: string;
  relatedType: string;
  relatedId: number;
  quantity: number;
  balanceAfter: number;
  movementDate: string;
  notes: string;
}

// Search parameters for raw cashew inventory
export interface RawCashewInventorySearchParams {
  cashewType?: string;
  cashewQuality?: string;
  location?: string;
}
