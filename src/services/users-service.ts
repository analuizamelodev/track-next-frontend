import { apiClient } from "../libs/api";
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserMutationResponse,
} from "../types/users-types";

export async function create(data: CreateUserDto): Promise<UserMutationResponse> {
  const response = await apiClient.post<UserMutationResponse>("/users", data);
  return response.data;
}

export async function findAll(): Promise<User[]> {
  const response = await apiClient.get<User[]>("/users");
  return response.data;
}

export async function findOne(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
}

export async function update(
  id: string,
  data: UpdateUserDto,
): Promise<UserMutationResponse> {
  const response = await apiClient.patch<UserMutationResponse>(
    `/users/${id}`,
    data,
  );
  return response.data;
}

export async function resetPassword(id: string): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>(
    `/users/${id}/reset-password`,
  );
  return response.data;
}
