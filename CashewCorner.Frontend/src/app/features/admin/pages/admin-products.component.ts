import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  AssignCategoryRequest,
} from '../../../core/models/product.models';
import { CategoryResponse } from '../../../core/models/category.models';
import { ProductFormModalComponent } from '../../../shared/components/product-form-modal.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormModalComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  categories: CategoryResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  selectedCategoryId: number | null = null;

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedProduct: ProductResponse | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search products.';
          this.isLoading = false;
        }
      });
    } else if (this.selectedCategoryId !== null) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load products by category.';
          this.isLoading = false;
        }
      });
    } else {
      this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load products.';
          this.isLoading = false;
        }
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  onSearch(): void {
    this.selectedCategoryId = null;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.searchTerm = '';
    this.loadProducts();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: ProductResponse): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  onSaveProduct(payload: CreateProductRequest | UpdateProductRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.productService.createProduct(payload as CreateProductRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to create product:', err);
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.productId, payload as UpdateProductRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to update product:', err);
        }
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete product.';
        }
      });
    }
  }

  assignCategory(productId: number, categoryId: number): void {
    const payload: AssignCategoryRequest = { categoryId };
    this.productService.assignCategoryToProduct(productId, payload).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to assign category.';
      }
    });
  }

  removeCategory(productId: number, categoryId: number): void {
    this.productService.removeCategoryFromProduct(productId, categoryId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to remove category.';
      }
    });
  }
}
