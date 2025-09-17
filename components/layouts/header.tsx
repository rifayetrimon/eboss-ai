'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';
import { usePersonalityContext } from '@/context/PersonalityContext';

interface HeaderProps {
    isCollapsed: boolean;
    activeItem: string;
}

export default function Header({ isCollapsed, activeItem }: HeaderProps) {
    const { refreshExpertise } = usePersonalityContext();

    const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
    const [selectedChatOption, setSelectedChatOption] = useState<string>('Internal');
    const [selectedTrainingType, setSelectedTrainingType] = useState<string>('Internal');
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const capitalize = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

    // Load expertise list
    useEffect(() => {
        const fetchExpertise = async () => {
            if (activeItem !== 'Personality') return;

            setLoading(true);
            try {
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/expertise');
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    setExpertiseList(data.data);

                    // ✅ First check localStorage
                    const storedExpertise = localStorage.getItem('selected_expertise');

                    if (storedExpertise) {
                        setSelectedExpertise(capitalize(storedExpertise));
                    } else {
                        // otherwise use API default
                        const defaultOption = data.current_expertise ? capitalize(data.current_expertise) : capitalize(data.data[0]);
                        setSelectedExpertise(defaultOption);
                        localStorage.setItem('selected_expertise', defaultOption.toLowerCase());
                    }
                } else {
                    setExpertiseList([]);
                }
            } catch (err) {
                console.error(err);
                setExpertiseList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExpertise();
    }, [activeItem]);

    // Handle selecting Personality expertise
    const handleExpertiseSelect = async (option: string) => {
        setSelectedExpertise(option);
        localStorage.setItem('selected_expertise', option.toLowerCase()); // ✅ save choice

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

            await refreshExpertise();
        } catch (err) {
            console.error('Error changing expertise:', err);
        }
    };

    // Dropdown renderer
    const renderDropdown = () => {
        if (activeItem === 'Personality') {
            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{selectedExpertise ? capitalize(selectedExpertise) : 'Select Expertise'}</span>
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
                                return (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleExpertiseSelect(capitalizedItem)}
                                            className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${selectedExpertise === capitalizedItem ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
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
            const chatOptions = ['Internal', 'Public'];
            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{selectedChatOption}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-40 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                        {chatOptions.map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => {
                                        setSelectedChatOption(item);
                                        localStorage.setItem('chat_level', item.toLowerCase());
                                    }}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
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
            return <div className="text-sm font-medium text-gray-700">Training Mode: {selectedTrainingType}</div>;
        }

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
