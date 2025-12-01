export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId: number;
  roleName: string;
  roleDescription: string;
  isActive: boolean;
  lastLogin: string | null;
  createdBy: number | null;
  createdAt: string;
  updatedBy: number | null;
  updatedAt: string | null;
}

export interface UserStatusResponse {
  userId: number;
  success: boolean;
  message: string;
  isActive: boolean;
}


