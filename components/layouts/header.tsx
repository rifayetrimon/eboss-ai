'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';
import { usePersonalityContext } from '@/context/PersonalityContext';
import { useSelector, useDispatch } from 'react-redux';
import { setChatLevel, initializeChatState } from '@/store/chatSlice';
import { RootState } from '@/store';

interface HeaderProps {
    isCollapsed: boolean;
    activeItem: string;
}

export default function Header({ isCollapsed, activeItem }: HeaderProps) {
    const { refreshExpertise, currentExpertiseData } = usePersonalityContext();
    const dispatch = useDispatch();
    const chatLevel = useSelector((state: RootState) => state.chat.chatLevel);

    const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const capitalize = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

    // ✅ Initialize chat state from localStorage on mount
    useEffect(() => {
        dispatch(initializeChatState());
    }, [dispatch]);

    // ✅ Sync dropdown with current expertise data from context
    useEffect(() => {
        if (currentExpertiseData?.current_expertise) {
            const currentExpertise = capitalize(currentExpertiseData.current_expertise);
            setSelectedExpertise(currentExpertise);
            console.log('🔄 Synced dropdown with current expertise:', currentExpertise);
        }
    }, [currentExpertiseData]);

    // ----------------- Load Expertise List -----------------
    useEffect(() => {
        const fetchExpertise = async () => {
            if (activeItem !== 'Personality') return;

            setLoading(true);
            try {
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/expertise');
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    setExpertiseList(data.data);

                    // ✅ Use context data as the primary source of truth
                    if (currentExpertiseData?.current_expertise) {
                        setSelectedExpertise(capitalize(currentExpertiseData.current_expertise));
                    } else {
                        // Fallback to API response if context is not available yet
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

    // ----------------- Handle Personality Expertise -----------------
    const handleExpertiseSelect = async (option: string) => {
        console.log('🔄 Changing expertise from', selectedExpertise, 'to', option);

        // Optimistically update the UI
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

            console.log('✅ Expertise changed successfully to:', option);

            // ✅ Notify other components about the expertise change
            window.dispatchEvent(
                new CustomEvent('expertiseChanged', {
                    detail: { expertise: option.toLowerCase() },
                }),
            );

            // ✅ Refresh the personality context to sync with PersonalContent
            await refreshExpertise();

            console.log('✅ Personality context refreshed and components notified');
        } catch (err) {
            console.error('❌ Error changing expertise:', err);

            // Revert the optimistic update on error
            if (currentExpertiseData?.current_expertise) {
                setSelectedExpertise(capitalize(currentExpertiseData.current_expertise));
            }
        }
    };

    // ✅ Handle chat level selection with better logging
    const handleChatLevelSelect = (option: string) => {
        const lowercaseOption = option.toLowerCase();
        console.log('🔄 Updating chat level from', chatLevel, 'to', lowercaseOption);
        dispatch(setChatLevel(lowercaseOption));
    };

    // ----------------- Dropdown Renderer -----------------
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
                    <ul className="w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
                        {loading ? (
                            <li className="px-4 py-2 text-gray-500">Loading...</li>
                        ) : expertiseList.length ? (
                            expertiseList.map((item) => {
                                const capitalizedItem = capitalize(item);
                                const isSelected = selectedExpertise === capitalizedItem;
                                return (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleExpertiseSelect(capitalizedItem)}
                                            className={`block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                                                isSelected ? 'bg-indigo-50 border-l-2 border-indigo-500 font-semibold text-indigo-700' : ''
                                            }`}
                                        >
                                            {capitalizedItem}
                                            {isSelected && <span className="ml-2 text-xs text-indigo-500">✓</span>}
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
            const chatOptions = ['Internal', 'Public'];
            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{capitalize(chatLevel)}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-40 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                        {chatOptions.map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => handleChatLevelSelect(item)}
                                    className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${chatLevel === item.toLowerCase() ? 'bg-gray-100 font-semibold' : ''}`}
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Dropdown>
            );
        }

        if (activeItem === 'Training') {
            return <div className="text-sm font-medium text-gray-700">Training Mode: Internal</div>;
        }

        return null;
    };

    // ✅ Debug info (remove in production)
    useEffect(() => {
        console.log('🎯 Current chat level in header:', chatLevel);
        console.log('🎯 Current selected expertise:', selectedExpertise);
        console.log('🎯 Context expertise data:', currentExpertiseData?.current_expertise);
    }, [chatLevel, selectedExpertise, currentExpertiseData]);

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
