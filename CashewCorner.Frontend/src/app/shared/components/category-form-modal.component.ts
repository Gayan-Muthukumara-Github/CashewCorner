import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateCategoryRequest, UpdateCategoryRequest, CategoryResponse } from '../../core/models/category.models';

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form-modal.component.html',
  styleUrl: './category-form-modal.component.scss'
})
export class CategoryFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() category: CategoryResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateCategoryRequest | UpdateCategoryRequest>();

  categoryForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.category) {
      this.categoryForm.patchValue({
        name: this.category.name,
        description: this.category.description,
      });
    } else {
      this.categoryForm.reset({
        name: '',
        description: '',
      });
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Category' : `Edit Category: ${this.category?.name}`;
  }

  onClose(): void {
    this.categoryForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      Object.values(this.categoryForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateCategoryRequest);
    } else {
      const updatePayload: UpdateCategoryRequest = {
        name: formValue.name,
        description: formValue.description,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get name() { return this.categoryForm.get('name'); }
  get description() { return this.categoryForm.get('description'); }
}
