import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../../core/models/user.models';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.scss'
})
export class UserFormModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user: UserResponse | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateUserRequest | UpdateUserRequest>();

  userForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      roleId: [2, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    if (this.mode === 'edit' && this.user) {
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        roleId: this.user.roleId,
      });
      // Password not required for edit
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('password')?.reset();
    } else {
      // Reset form for create mode
      this.userForm.reset({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        roleId: 2,
      });
      // Password required for create
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New User' : `Edit User: ${this.user?.username}`;
  }

  get showPasswordField(): boolean {
    return this.mode === 'create';
  }

  onClose(): void {
    this.userForm.reset();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    const formValue = this.userForm.value;

    if (this.mode === 'create') {
      this.save.emit(formValue as CreateUserRequest);
    } else {
      const updatePayload: UpdateUserRequest = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        roleId: formValue.roleId,
      };
      this.save.emit(updatePayload);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get email() { return this.userForm.get('email'); }
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get roleId() { return this.userForm.get('roleId'); }
}

