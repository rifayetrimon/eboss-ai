'use client';

import { Power } from 'lucide-react';

interface HeaderProps {
    isCollapsed: boolean;
    onToggleChat?: () => void;
}

export default function Header({ isCollapsed, onToggleChat }: HeaderProps) {
    return (
        <header
            className={`
                fixed top-0 left-0 right-0 h-14 bg-white shadow
                flex items-center justify-between px-6 z-20
                transition-all duration-300
                ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}
            `}
        >
            {/* Left: Title */}
            <h1 className="text-xl font-semibold text-gray-800">Eboss AI</h1>

            {/* Right: Temporary chat toggle */}
            <button onClick={onToggleChat} className="p-2 rounded-md hover:bg-gray-100 transition-colors" aria-label="Turn off temporary chat">
                <Power className="h-5 w-5 text-gray-600" />
            </button>
        </header>
    );
}
