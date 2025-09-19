// context/PersonalityContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { fetchCurrentExpertise } from '@/services/ai/personality';

interface PersonalityData {
    name: string;
    current_expertise: string;
    description: string;
    specialization: string;
    personality_traits: string[];
    temperature: number;
    max_tokens: number;
    image: string;
}

interface PersonalityContextType {
    currentExpertiseData: PersonalityData | null;
    loading: boolean;
    error: string | null;
    refreshExpertise: () => Promise<void>;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

interface PersonalityProviderProps {
    children: ReactNode;
}

export function PersonalityProvider({ children }: PersonalityProviderProps) {
    const [currentExpertiseData, setCurrentExpertiseData] = useState<PersonalityData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshExpertise = useCallback(async () => {
        console.log('🔄 PersonalityContext: Starting expertise refresh...');
        setLoading(true);
        setError(null);

        try {
            const data = await fetchCurrentExpertise();
            setCurrentExpertiseData(data);
            console.log('✅ PersonalityContext: Expertise data updated:', data.current_expertise);

            // ✅ Dispatch a custom event to notify other parts of the app
            window.dispatchEvent(
                new CustomEvent('personalityUpdated', {
                    detail: { expertise: data.current_expertise },
                }),
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch expertise';
            setError(errorMessage);
            console.error('❌ PersonalityContext: Error fetching expertise:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ Initial load on mount
    useEffect(() => {
        refreshExpertise();
    }, [refreshExpertise]);

    // ✅ Listen for expertise changes from other parts of the app
    useEffect(() => {
        const handleExpertiseChange = () => {
            console.log('🔔 PersonalityContext: Received expertise change notification');
            setTimeout(() => refreshExpertise(), 500); // Small delay to ensure API is updated
        };

        window.addEventListener('expertiseChanged', handleExpertiseChange);

        return () => {
            window.removeEventListener('expertiseChanged', handleExpertiseChange);
        };
    }, [refreshExpertise]);

    const contextValue: PersonalityContextType = {
        currentExpertiseData,
        loading,
        error,
        refreshExpertise,
    };

    return <PersonalityContext.Provider value={contextValue}>{children}</PersonalityContext.Provider>;
}

export function usePersonalityContext() {
    const context = useContext(PersonalityContext);
    if (context === undefined) {
        throw new Error('usePersonalityContext must be used within a PersonalityProvider');
    }
    return context;
}

// ✅ Hook for components that only need to trigger expertise changes
export function useExpertiseSync() {
    const { refreshExpertise } = usePersonalityContext();

    const notifyExpertiseChange = useCallback((expertise: string) => {
        console.log('📢 Broadcasting expertise change:', expertise);
        window.dispatchEvent(
            new CustomEvent('expertiseChanged', {
                detail: { expertise },
            }),
        );
    }, []);

    return { refreshExpertise, notifyExpertiseChange };
}
