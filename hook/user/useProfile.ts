// hook/user/useProfile.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services/user/userService';

export const useProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        enabled: typeof window !== 'undefined' && Boolean(localStorage.getItem('user_id') && localStorage.getItem('userToken')),
    });
};
