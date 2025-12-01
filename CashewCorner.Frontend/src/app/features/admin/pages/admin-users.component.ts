import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../core/services/user.service';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../../../core/models/user.models';
import { UserFormModalComponent } from '../../../shared/components/user-form-modal.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, UserFormModalComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  users: UserResponse[] = [];
  isLoading = false;
  errorMessage = '';

  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: UserResponse | null = null;

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: UserResponse): void {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  onSaveUser(payload: CreateUserRequest | UpdateUserRequest): void {
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.userService.createUser(payload as CreateUserRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to create user.';
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.userId, payload as UpdateUserRequest).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to update user.';
        }
      });
    }
  }

  toggleActive(user: UserResponse): void {
    const action$ = user.isActive
      ? this.userService.deactivateUser(user.userId)
      : this.userService.activateUser(user.userId);

    action$.subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to update user status.';
      }
    });
  }

}


