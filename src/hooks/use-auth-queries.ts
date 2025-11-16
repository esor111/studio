import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types/user';
import { useAuthStore } from '@/store/auth-store';
import { setToken } from '@/lib/auth/token';

export function useLogin() {
  const { setUser, setToken: setStoreToken } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.token && data.user) {
        setToken(data.token);
        setStoreToken(data.token);
        setUser(data.user);
      }
    },
  });
}

export function useRegister() {
  const { setUser, setToken: setStoreToken } = useAuthStore();
  
  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: (data) => {
      if (data.success && data.token && data.user) {
        setToken(data.token);
        setStoreToken(data.token);
        setUser(data.user);
      }
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => AuthService.getProfile(),
    enabled: !!useAuthStore.getState().token,
  });
}