export interface CreateRawCashewRequest {
  cashewType: string;
  cashewQuality?: string;
  description?: string;
}

export interface UpdateRawCashewRequest {
  cashewType?: string;
  cashewQuality?: string;
  description?: string;
}

export interface RawCashewResponse {
  cashewTypeId: number;
  cashewType: string;
  cashewQuality: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
