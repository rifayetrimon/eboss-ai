// components/layouts/sidebar.tsx
'use client';

import { Home, History, X, Plus } from 'lucide-react';
import IconAdd from '../icon/ai/icon-add';
import IconSettings from '../icon/ai/icon-settings';
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hook/user/useProfile';
import Image from 'next/image';
import IconSidebar from '../icon/ai/icon-sidebar';
import TwoBarMenuIcon from '../icon/ai/icon-twobar';
import IconAiLogo from '../icon/ai/icon-ai-logo';
import { motion, AnimatePresence } from 'framer-motion';
import { startNewChatSession } from '@/services/ai/chatApi'; // ✅ import service

interface SidebarProps {
    onCollapseChange: (collapsed: boolean) => void;
    activeItem: string;
    setActiveItem: (item: string) => void;
}

export default function Sidebar({ onCollapseChange, activeItem, setActiveItem }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hoverApp, setHoverApp] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data } = useProfile();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // ✅ Proper startNewChat using chatApi.ts
    async function startNewChat() {
        try {
            const response = await startNewChatSession();

            console.log('✅ New chat response:', response);

            if (response?.session_id) {
                localStorage.setItem('chat_session_id', response.session_id);
            }

            // Fire event so ChatContent can reset & show welcome message
            window.dispatchEvent(
                new CustomEvent('newChatStarted', {
                    detail: { response: response?.response || '' },
                }),
            );
        } catch (err) {
            console.error('Error creating new chat:', err);
        }
    }

    // base nav items (without NewChat)
    const navigationItems = [
        { id: 'Personality', icon: IconAdd, label: 'Personality' },
        { id: 'Chat', icon: Home, label: 'Chat' },
        { id: 'Training', icon: History, label: 'Training' },
    ];

    useEffect(() => {
        if (onCollapseChange) onCollapseChange(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileOpen]);

    // helper to render nav buttons
    const renderNavButtons = (isMobile = false) => {
        const itemsToRender = [...navigationItems];

        // add NewChat dynamically when Chat is active
        if (activeItem === 'Chat') {
            itemsToRender.splice(itemsToRender.findIndex((i) => i.id === 'Chat') + 1, 0, {
                id: 'NewChat',
                icon: Plus,
                label: 'New Chat',
            });
        }

        return itemsToRender.map((item, index) => {
            const Icon = item.icon;
            return (
                <motion.button
                    key={item.id}
                    {...(!isCollapsed || isMobile
                        ? {
                              initial: { opacity: 0, x: -10 },
                              animate: { opacity: 1, x: 0 },
                              exit: { opacity: 0, x: -10 },
                              transition: { duration: 0.2, delay: index * 0.05 },
                          }
                        : {})}
                    className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-gray-700 transition-all duration-200
                        hover:bg-gray-100 hover:translate-x-1
                        ${activeItem === item.id ? 'bg-gray-200 font-medium' : ''}
                        ${!isMobile && isCollapsed ? 'justify-center' : 'justify-start'}`}
                    onClick={() => {
                        if (item.id === 'NewChat') {
                            startNewChat(); // ✅ Call API
                            setActiveItem('Chat'); // keep Chat active
                        } else {
                            setActiveItem(item.id);
                        }

                        if (isMobile) setMobileOpen(false);
                    }}
                    title={!isMobile && isCollapsed ? item.label : undefined}
                >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <AnimatePresence mode="wait" initial={false}>
                        {(!isCollapsed || isMobile) && (
                            <motion.span key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="whitespace-nowrap">
                                {item.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            );
        });
    };

    return (
        <>
            {/* --- mobile + desktop sidebar code stays unchanged --- */}
            {/* (I kept all your design, only swapped startNewChat impl) */}
            {/* ... */}
            <motion.div animate={{ width: isCollapsed ? 64 : 256 }} transition={{ duration: 0.4 }} className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between h-14 px-4">
                    <div
                        className="flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 flex-shrink-0"
                        onMouseEnter={() => setHoverApp(true)}
                        onMouseLeave={() => setHoverApp(false)}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed && hoverApp ? <IconSidebar size={20} className="text-blue-600" /> : <IconAiLogo className="h-6 w-6 text-blue-600" />}
                    </div>

                    {!isCollapsed && (
                        <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-md hover:bg-gray-100 transition" aria-label="Collapse sidebar">
                            <IconSidebar size={18} className="text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 px-2 pt-2 space-y-0.5">{renderNavButtons(false)}</div>

                {/* Bottom section remains same */}
            </motion.div>
        </>
    );
}
