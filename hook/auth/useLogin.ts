import { loginUser } from '@/services/auth/authService';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ username, password, options }: { username: string; password: string; options?: { loginType?: string; firebaseId?: string; deviceSpec?: Record<string, any> } }) =>
            loginUser(username, password, options),
        onSuccess: (data) => {
            console.log('Login successful:', data);
        },
        onError: (error: any) => {
            console.error('Login failed:', error.response?.data || error.message);
        },
    });
};
