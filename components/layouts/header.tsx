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
    const [selectedTrainingType, setSelectedTrainingType] = useState<string>('Internal');
    const [expertiseList, setExpertiseList] = useState<string[]>([]);
    const [trainingList, setTrainingList] = useState<string[]>([]);
    const [categoryList, setCategoryList] = useState<{ value: string; display_name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                    setSelectedOption(capitalize(data.data[0])); // default
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

        const fetchTraining = async () => {
            if (activeItem !== 'Training') return;
            setLoading(true);
            try {
                // Fetch training list
                const res = await fetch('https://devapi02.awfatech.com/api/v1/llm/training-list');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setTrainingList(data.data);
                    setSelectedOption(capitalize(data.data[0]));
                } else {
                    setTrainingList([]);
                }

                // Fetch categories for 2nd dropdown
                const catRes = await fetch('https://devapi02.awfatech.com/api/v1/llm/categories');
                const catData = await catRes.json();
                if (catData.success && Array.isArray(catData.data)) {
                    setCategoryList(catData.data);
                    setSelectedCategory(catData.data[0].display_name); // default first category
                } else {
                    setCategoryList([]);
                }
            } catch (err) {
                console.error(err);
                setTrainingList([]);
                setCategoryList([]);
            } finally {
                setLoading(false);
            }
        };

        if (activeItem === 'Chat') {
            setSelectedOption('Internal'); // default for Chat
        }

        fetchExpertise();
        fetchTraining();
    }, [activeItem]);

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
                                    <button onClick={() => setSelectedOption(capitalize(item))} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
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
            const trainingStaticOptions = ['Internal', 'Public'];
            return (
                <div className="flex gap-2">
                    {/* First dropdown - training type */}
                    <Dropdown
                        button={
                            <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                <span>{selectedTrainingType}</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        }
                    >
                        <ul className="w-40 bg-white border rounded-md shadow-lg py-1 text-sm text-gray-700">
                            {trainingStaticOptions.map((item) => (
                                <li key={item}>
                                    <button onClick={() => handleTrainingTypeSelect(item)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Dropdown>

                    {/* Second dropdown - categories */}
                    <Dropdown
                        button={
                            <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                <span>{selectedCategory || 'Select Category'}</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        }
                    >
                        <ul className="w-56 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto py-1 text-sm text-gray-700">
                            {loading ? (
                                <li className="px-4 py-2 text-gray-500">Loading...</li>
                            ) : categoryList.length ? (
                                categoryList.map((item) => (
                                    <li key={item.value}>
                                        <button onClick={() => setSelectedCategory(item.display_name)} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                            {item.display_name}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-500">No categories</li>
                            )}
                        </ul>
                    </Dropdown>
                </div>
            );
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
