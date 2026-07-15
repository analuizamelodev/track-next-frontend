import { UserRole } from "../libs/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  isTempPassword: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserMutationResponse {
  message: string;
  user: User;
}
