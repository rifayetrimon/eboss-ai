import { useMutation } from '@tanstack/react-query';
import { loginUserWithAppcode } from '@/services/auth/authService';

export const useAppCode = () => {
  return useMutation({
    mutationFn: loginUserWithAppcode,
    onSuccess: (data) => {
      console.log('AppCode valid:', data);
      // Navigate to login page or show login form
    },
    onError: (error: any) => {
      console.error('AppCode failed:', error.response?.data || error.message);
    },
  });
};

// import { useMutation } from '@tanstack/react-query';
// import { loginUserWithAppcode } from '@/services/auth/authService';

// export const useAppCode = () => {
//     return useMutation({
//         mutationFn: loginUserWithAppcode,
//     });
// };
