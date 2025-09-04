'use client';

import React from 'react';
import IconTempMessage from '../icon/ai/icon-temp-message';

interface HeaderProps {
    isCollapsed: boolean;
    onToggleChat?: () => void;
}

export default function Header({ isCollapsed, onToggleChat }: HeaderProps) {
    return (
        <header
            className={`fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-white shadow-sm z-20 transition-all duration-300
        ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
      `}
        >
            {/* Left: Title */}
            <h1 className="text-xl font-semibold text-gray-800">EbossAI</h1>

            {/* Right: Temporary chat toggle */}
            <button onClick={onToggleChat} className="p-2 rounded-md hover:bg-gray-100 transition-colors" aria-label="Turn off temporary chat">
                <IconTempMessage className="h-5 w-5" />
            </button>
        </header>
    );
}
