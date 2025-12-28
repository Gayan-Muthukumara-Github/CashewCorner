import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../../core/services/category.service';
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from '../../../core/models/category.models';
import { CategoryFormModalComponent } from '../../../shared/components/category-form-modal.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryFormModalComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {
  categories: CategoryResponse[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategory: CategoryResponse | null = null;

  constructor(private readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.searchTerm) {
      this.categoryService.searchCategories(this.searchTerm).subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to search categories.';
          this.isLoading = false;
        }
      });
    } else {
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load categories.';
          this.isLoading = false;
        }
      });
    }
  }

  onSearch(): void {
    this.loadCategories();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedCategory = null;
    this.isModalOpen = true;
  }

  openEditModal(category: CategoryResponse): void {
    this.modalMode = 'edit';
    this.selectedCategory = category;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCategory = null;
  }

  onSaveCategory(payload: CreateCategoryRequest | UpdateCategoryRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.categoryService.createCategory(payload as CreateCategoryRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create category.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.categoryId, payload as UpdateCategoryRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update category.';
        }
      });
    }
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to delete category.';
        }
      });
    }
  }
}
