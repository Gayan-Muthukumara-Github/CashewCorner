import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
} from '../../core/models/product.models';
import { CategoryResponse } from '../../core/models/category.models';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss'
})
export class ProductFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() product: ProductResponse | null = null;
  @Input() allCategories: CategoryResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateProductRequest | UpdateProductRequest>();
  @Output() assignCategory = new EventEmitter<{ productId: number; categoryId: number }>();

  productForm: FormGroup;
  selectedCategoryToAssign: number | null = null;

  constructor(private readonly fb: FormBuilder) {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      costPrice: [0, [Validators.required, Validators.min(0)]],
      sellPrice: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.product) {
      this.productForm.patchValue({
        sku: this.product.sku,
        name: this.product.name,
        description: this.product.description,
        unit: this.product.unit,
        costPrice: this.product.costPrice,
        sellPrice: this.product.sellPrice,
        reorderLevel: this.product.reorderLevel,
      });
      this.productForm.get('sku')?.disable();
    } else {
      this.productForm.reset({
        sku: '',
        name: '',
        description: '',
        unit: '',
        costPrice: 0,
        sellPrice: 0,
        reorderLevel: 0,
      });
      this.productForm.get('sku')?.enable();
    }
    this.selectedCategoryToAssign = null;
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Product' : `Edit Product: ${this.product?.name}`;
  }

  onClose(): void {
    this.productForm.reset();
    this.productForm.get('sku')?.enable(); // Ensure SKU is enabled on close
    this.close.emit();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.productForm.getRawValue(); // Use getRawValue to get disabled SKU value

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateProductRequest);
    } else {
      const updatePayload: UpdateProductRequest = {
        name: formValue.name,
        description: formValue.description,
        unit: formValue.unit,
        costPrice: formValue.costPrice,
        sellPrice: formValue.sellPrice,
        reorderLevel: formValue.reorderLevel,
      };
      this.save.emit(updatePayload);
    }
  }

  onAssignCategory(): void {
    if (this.product && this.selectedCategoryToAssign) {
      // Check if category is already assigned
      const isAssigned = this.product.categories.some(
        (cat) => cat.categoryId === this.selectedCategoryToAssign
      );
      if (!isAssigned) {
        this.assignCategory.emit({
          productId: this.product.productId,
          categoryId: this.selectedCategoryToAssign,
        });
      } else {
        // Optionally, provide feedback that category is already assigned
        console.log('Category already assigned to this product.');
      }
      this.selectedCategoryToAssign = null;
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get sku() { return this.productForm.get('sku'); }
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get unit() { return this.productForm.get('unit'); }
  get costPrice() { return this.productForm.get('costPrice'); }
  get sellPrice() { return this.productForm.get('sellPrice'); }
  get reorderLevel() { return this.productForm.get('reorderLevel'); }
}
