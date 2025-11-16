import { apiClient } from '@/lib/api/client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/user';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  static async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  static async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }
}