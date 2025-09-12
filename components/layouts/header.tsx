'use client';

import React, { useState } from 'react';
import IconTempMessage from '../icon/ai/icon-temp-message';
import Tippy from '@tippyjs/react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../dropdown';

interface HeaderProps {
    isCollapsed: boolean;
    onToggleChat?: () => void;
}

export default function Header({ isCollapsed, onToggleChat }: HeaderProps) {
    const [selectedOption, setSelectedOption] = useState<'Public' | 'Internal'>('Public');

    const handleSelect = (option: 'Public' | 'Internal') => {
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
                {/* ✅ Using Dropdown component */}
                <Dropdown
                    button={
                        <div className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md bg-white shadow-sm hover:bg-gray-50">
                            <span>{selectedOption}</span>
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
