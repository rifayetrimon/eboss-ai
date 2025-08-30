// 'use client';

// import { useCallback } from 'react';

// export function useLogout() {
//     const logout = useCallback(() => {
//         try {
//             const encryptedKey = localStorage.getItem('x-encrypted-key');
//             const userToken = localStorage.getItem('userToken');

//             // Clear all auth-related items
//             localStorage.removeItem('user_id');
//             localStorage.removeItem('encrypted_user');
//             localStorage.removeItem('userToken');
//             // localStorage.removeItem('x-encrypted-key');

//             // Redirect to login
//             window.location.href = '/login';
//         } catch (error) {
//             console.error('Error signing out:', error);
//             throw error;
//         }
//     }, []);

//     return logout;
// }

'use client';
import { useRouter } from 'next/navigation';

export function useLogout() {
    const router = useRouter();

    return () => {
        // Clear localStorage
        localStorage.removeItem('user_id');
        localStorage.removeItem('encrypted_user');
        localStorage.removeItem('userToken');
        // localStorage.removeItem('x-encrypted-key');s

        // Redirect to login
        router.push('/auth/login');
    };
}
