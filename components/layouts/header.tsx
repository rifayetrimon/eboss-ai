'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';
import { usePersonalityContext } from '@/context/PersonalityContext';

interface HeaderProps {
    isCollapsed: boolean;
    activeItem: string; // Chat | Training | Personality
}

export default function Header({ isCollapsed, activeItem }: HeaderProps) {
    const { refreshExpertise } = usePersonalityContext();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedTrainingType, setSelectedTrainingType] = useState<string>('Internal'); // For Training section
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ value: string; display_name: string }[]>([]);
    const [loading, setLoading] = useState(false);

    // Capitalize string helper
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleTrainingTypeSelect = (type: string) => {
        setSelectedTrainingType(type);
    };

    useEffect(() => {
        const fetchExpertise = async () => {
            if (activeItem !== 'Personality') return;
            setLoading(true);
            try {
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/expertise');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setExpertiseList(data.data);

                    // Use current_expertise as default if available
                    const defaultOption = data.current_expertise ? capitalize(data.current_expertise) : capitalize(data.data[0]);
                    setSelectedOption(defaultOption);
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

        if (activeItem === 'Chat' && !selectedOption) {
            setSelectedOption('Internal'); // Default for Chat
        }

        fetchExpertise();
    }, [activeItem]);

    const handleSelect = async (option: string) => {
        setSelectedOption(option);

        if (activeItem === 'Personality') {
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
        }
    };

    const renderDropdown = () => {
        if (activeItem === 'Personality') {
            return (
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{selectedOption || 'Select Expertise'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
                        {loading ? (
                            <li className="px-4 py-2 text-gray-500">Loading...</li>
                        ) : expertiseList.length ? (
                            expertiseList.map((item) => (
                                <li key={item}>
                                    <button onClick={() => handleSelect(capitalize(item))} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        {capitalize(item)}
                                    </button>
                                </li>
                            ))
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
                            <span>{selectedOption || 'Select Chat Type'}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    }
                >
                    <ul className="w-40 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                        {chatOptions.map((item) => (
                            <li key={item}>
                                <button onClick={() => setSelectedOption(item)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Dropdown>
            );
        }

        if (activeItem === 'Training') {
            // ❌ Removed dropdown, only static label
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
