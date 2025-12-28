export interface CreateProductRequest {
  sku: string;
  name: string;
  description: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  reorderLevel: number;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  description?: string;
  unit?: string;
  costPrice?: number;
  sellPrice?: number;
  reorderLevel?: number;
}

export interface ProductResponse {
  productId: number;
  sku: string;
  name: string;
  description: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
  categories: { categoryId: number; name: string }[];
}

export interface AssignCategoryRequest {
  categoryId: number;
}

export interface RemoveCategoryRequest {
  categoryId: number;
}
