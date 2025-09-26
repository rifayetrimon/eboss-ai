// hook/auth/useAppCode.ts
import { useMutation } from '@tanstack/react-query';
import { loginUserWithAppcode } from '@/services/auth/authService';
import { useAppDispatch } from '@/store/hook';
import { setEncryptedKey } from '@/store/chatSessionSlice';

export const useAppCode = () => {
    const dispatch = useAppDispatch();
    return useMutation({
        mutationFn: async (appCode: string) => {
            try {
                console.log('Validating app code:', appCode);
                const result = await loginUserWithAppcode(appCode);
                dispatch(setEncryptedKey(result));
                console.log('AppCode validation successful:', result);
                return result;
            } catch (error: any) {
                console.error('AppCode validation failed:', error);
                throw error;
            }
        },
        retry: (failureCount, error: any) => {
            // Only retry on network errors, not validation errors
            const isNetworkError = !error?.response;
            return failureCount < 2 && isNetworkError;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    });
};

// import { useMutation } from '@tanstack/react-query';
// import { loginUserWithAppcode } from '@/services/auth/authService';

// export const useAppCode = () => {
//     return useMutation({
//         mutationFn: loginUserWithAppcode,
//     });
// };
