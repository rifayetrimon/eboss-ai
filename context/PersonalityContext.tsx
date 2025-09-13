'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentExpertise } from '@/services/ai/personality';

interface PersonalityContextType {
    currentExpertiseData: any;
    refreshExpertise: () => Promise<void>;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(undefined);

export const PersonalityProvider = ({ children }: { children: ReactNode }) => {
    const [currentExpertiseData, setCurrentExpertiseData] = useState<any>(null);

    const refreshExpertise = async () => {
        try {
            const data = await fetchCurrentExpertise();
            setCurrentExpertiseData(data);
        } catch (err) {
            console.error('Failed to fetch current expertise:', err);
        }
    };

    useEffect(() => {
        refreshExpertise();
    }, []);

    return <PersonalityContext.Provider value={{ currentExpertiseData, refreshExpertise }}>{children}</PersonalityContext.Provider>;
};

export const usePersonalityContext = () => {
    const context = useContext(PersonalityContext);
    if (!context) throw new Error('usePersonalityContext must be used within PersonalityProvider');
    return context;
};
