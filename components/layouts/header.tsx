'use client';

import React, { useState } from 'react';
import IconTempMessage from '../icon/ai/icon-temp-message';
import Tippy from '@tippyjs/react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';

interface HeaderProps {
    isCollapsed: boolean;
    onToggleChat?: () => void;
    activeItem: string; // sidebar active item passed down (Chat | Training | Personal)
}

export default function Header({ isCollapsed, onToggleChat, activeItem }: HeaderProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-20 bg-white shadow-sm transition-all duration-300
                ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
            `}
        >
            {/* Left: Title */}
            <h1 className="text-xl font-semibold text-gray-800">EbossAI</h1>

            {/* Right side */}
            <div className="flex items-center gap-3 relative">
                {/* ✅ Dropdown for Chat & Training */}
                {(activeItem === 'Chat' || activeItem === 'Training') && (
                    <Dropdown
                        button={
                            <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                <span className={selectedOption ? 'text-gray-800' : 'text-gray-400'}>{selectedOption || 'Select'}</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        }
                    >
                        <div className="w-32 bg-white border rounded-md shadow-lg">
                            <ul className="py-1 text-sm text-gray-700">
                                <li>
                                    <button onClick={() => handleSelect('Internal')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        Internal
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSelect('Public')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        Public
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </Dropdown>
                )}

                {/* ✅ Different dropdown for Personal */}
                {activeItem === 'Personality' && (
                    <Dropdown
                        button={
                            <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                                <span className="text-gray-800">Personal</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        }
                    >
                        <div className="w-40 bg-white border rounded-md shadow-lg">
                            <ul className="py-1 text-sm text-gray-700">
                                <li>
                                    <button onClick={() => handleSelect('Profile')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        Maketer
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSelect('Settings')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        CFO
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSelect('Settings')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        IT
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleSelect('Settings')} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                        Biker
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </Dropdown>
                )}

                {/* Temp chat toggle */}
                <Tippy content="Turn on temporary chat" className="bg-gray-200 text-xs text-gray-600 rounded-md p-1" placement="bottom">
                    <button onClick={onToggleChat} className="p-2 rounded-md hover:bg-gray-100 transition-colors" aria-label="Turn off temporary chat">
                        <IconTempMessage className="h-5 w-5" />
                    </button>
                </Tippy>
            </div>
        </header>
    );
}
