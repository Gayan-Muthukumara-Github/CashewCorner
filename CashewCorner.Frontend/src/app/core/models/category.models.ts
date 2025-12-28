export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  categoryId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
