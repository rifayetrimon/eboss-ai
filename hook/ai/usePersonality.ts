// hooks/personal/usePersonality.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentExpertise } from '@/services/ai/personality';

export const usePersonality = () => {
    return useQuery({
        queryKey: ['currentExpertise'],
        queryFn: fetchCurrentExpertise,
        enabled: typeof window !== 'undefined' && Boolean(localStorage.getItem('x-encrypted-key')),
    });
};
