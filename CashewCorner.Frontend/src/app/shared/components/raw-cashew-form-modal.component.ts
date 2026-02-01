import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateRawCashewRequest, UpdateRawCashewRequest, RawCashewResponse } from '../../core/models/raw-cashew.models';

@Component({
  selector: 'app-raw-cashew-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raw-cashew-form-modal.component.html',
  styleUrl: './raw-cashew-form-modal.component.scss'
})
export class RawCashewFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() rawCashew: RawCashewResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateRawCashewRequest | UpdateRawCashewRequest>();

  rawCashewForm: FormGroup;

  // Common cashew type options
  cashewTypeOptions = ['W180', 'W210', 'W240', 'W320', 'W450', 'SW', 'SS', 'LP', 'SP', 'BB', 'SB'];
  qualityOptions = ['Premium', 'Standard', 'Economy', 'Grade A', 'Grade B', 'Grade C'];

  constructor(private readonly fb: FormBuilder) {
    this.rawCashewForm = this.fb.group({
      cashewType: ['', [Validators.required, Validators.minLength(2)]],
      cashewQuality: [''],
      description: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.rawCashew) {
      this.rawCashewForm.patchValue({
        cashewType: this.rawCashew.cashewType,
        cashewQuality: this.rawCashew.cashewQuality || '',
        description: this.rawCashew.description || '',
      });
    } else {
      this.rawCashewForm.reset({
        cashewType: '',
        cashewQuality: '',
        description: '',
      });
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Raw Cashew Type' : `Edit Raw Cashew: ${this.rawCashew?.cashewType}`;
  }

  onClose(): void {
    this.rawCashewForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.rawCashewForm.invalid) {
      Object.values(this.rawCashewForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.rawCashewForm.value;

    if (this.mode === 'create') {
      const createPayload: CreateRawCashewRequest = {
        cashewType: formValue.cashewType,
        cashewQuality: formValue.cashewQuality || undefined,
        description: formValue.description || undefined,
      };
      this.save.emit(createPayload);
    } else {
      const updatePayload: UpdateRawCashewRequest = {
        cashewType: formValue.cashewType,
        cashewQuality: formValue.cashewQuality || undefined,
        description: formValue.description || undefined,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get cashewType() { return this.rawCashewForm.get('cashewType'); }
  get cashewQuality() { return this.rawCashewForm.get('cashewQuality'); }
  get description() { return this.rawCashewForm.get('description'); }
}
