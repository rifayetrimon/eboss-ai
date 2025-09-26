// components/layouts/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';
import { usePersonalityContext } from '@/context/PersonalityContext';
import { useSelector, useDispatch } from 'react-redux';
import { setChatLevel, initializeChatState } from '@/store/chatSlice';
import { IRootState } from '@/store';

interface HeaderProps {
    isCollapsed: boolean;
    activeItem: string;
}

export default function Header({ isCollapsed, activeItem }: HeaderProps) {
    const { refreshExpertise, currentExpertiseData } = usePersonalityContext() || {};
    const dispatch = useDispatch();
    const chatLevel = useSelector((state: IRootState) => state?.chat?.chatLevel);

    const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const capitalize = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

    const chatOptions = [
        { label: 'Internal', value: 'internal' },
        { label: 'Public', value: 'public' },
    ];

    useEffect(() => {
        dispatch(initializeChatState());
    }, [dispatch]);

    useEffect(() => {
        if (currentExpertiseData?.current_expertise) {
            const currentExpertise = capitalize(currentExpertiseData.current_expertise);
            setSelectedExpertise(currentExpertise);
        }
    }, [currentExpertiseData]);

    useEffect(() => {
        const fetchExpertise = async () => {
            if (activeItem !== 'Personality') return;
            setLoading(true);
            try {
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/expertise');
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    setExpertiseList(data.data);
                    if (currentExpertiseData?.current_expertise) {
                        setSelectedExpertise(capitalize(currentExpertiseData.current_expertise));
                    } else {
                        const defaultOption = data.current_expertise ? capitalize(data.current_expertise) : capitalize(data.data[0]);
                        setSelectedExpertise(defaultOption);
                    }
                } else {
                    setExpertiseList([]);
                }
            } catch (err) {
                console.error('❌ Error fetching expertise list:', err);
                setExpertiseList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExpertise();
    }, [activeItem, currentExpertiseData]);

    const handleExpertiseSelect = async (option: string) => {
        setSelectedExpertise(option);
        try {
            const encryptedKey = localStorage.getItem('x-encrypted-key');
            if (!encryptedKey) throw new Error('Missing x-encrypted-key');

            const response = await fetch('https://devapi02.awfatech.com/api/v1/llm/change-expertise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-encrypted-key': encryptedKey,
                },
                body: JSON.stringify({ expertise: option.toLowerCase() }),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || 'Failed to change expertise');
            }

            window.dispatchEvent(new CustomEvent('expertiseChanged', { detail: { expertise: option.toLowerCase() } }));
            refreshExpertise && (await refreshExpertise());
        } catch (err) {
            console.error('❌ Error changing expertise:', err);
            if (currentExpertiseData?.current_expertise) {
                setSelectedExpertise(capitalize(currentExpertiseData.current_expertise));
            }
        }
    };

    const handleChatLevelSelect = (value: string) => {
        dispatch(setChatLevel(value));
        window.dispatchEvent(
            new CustomEvent('chatLevelChanged', {
                detail: { newLevel: value, oldLevel: chatLevel },
            }),
        );
    };

    const renderDropdown = () => {
        if (activeItem === 'Personality') {
            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{selectedExpertise ? selectedExpertise : 'Select Expertise'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-44 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
                        {loading ? (
                            <li className="px-4 py-2 text-gray-500">Loading...</li>
                        ) : expertiseList.length ? (
                            expertiseList.map((item) => {
                                const capitalizedItem = capitalize(item);
                                return (
                                    <li key={item}>
                                        <button onClick={() => handleExpertiseSelect(capitalizedItem)} className="flex w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors">
                                            {capitalizedItem}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No data</li>
                        )}
                    </ul>
                </Dropdown>
            );
        }

        if (activeItem === 'Chat') {
            const currentOption = chatOptions.find((opt) => opt.value === chatLevel);
            const displayLabel = currentOption?.label || 'Public';

            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{displayLabel}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-44 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                        {chatOptions.map((opt) => (
                            <li key={opt.value}>
                                <button onClick={() => handleChatLevelSelect(opt.value)} className="flex w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors">
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Dropdown>
            );
        }

        // if (activeItem === 'Training') {
        //     return <div className="text-sm font-medium text-gray-700">Training Mode: Internal</div>;
        // }

        return null;
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-20 bg-white shadow-sm transition-all duration-300
        ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}
        >
            <h1 className="text-xl font-semibold text-gray-800">EbossAI</h1>
            <div className="flex items-center gap-3 relative">{renderDropdown()}</div>
        </header>
    );
}
