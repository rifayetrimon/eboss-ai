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
import { startNewChatSession } from '@/services/ai/chatApi';
import { fetchChatSessions, ChatSession } from '@/services/ai/sidebar';

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

    // ✅ Chat sessions state
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Load sessions on mount
    useEffect(() => {
        const loadSessions = async () => {
            try {
                setLoading(true);
                const list = await fetchChatSessions();
                setSessions(list);
            } catch (err) {
                console.error('❌ Failed to fetch chat sessions:', err);
            } finally {
                setLoading(false);
            }
        };
        loadSessions();
    }, []);

    // ✅ Listen for chatSessionsUpdated events
    useEffect(() => {
        const handleSessionsUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<ChatSession[]>;
            setSessions(customEvent.detail);
        };

        window.addEventListener('chatSessionsUpdated', handleSessionsUpdate);

        return () => {
            window.removeEventListener('chatSessionsUpdated', handleSessionsUpdate);
        };
    }, []);

    // ✅ Start new chat
    async function startNewChat() {
        try {
            const response = await startNewChatSession();
            console.log('✅ New chat response:', response);

            if (response?.session_id) {
                localStorage.setItem('chat_session_id', response.session_id);
            }

            window.dispatchEvent(
                new CustomEvent('newChatStarted', {
                    detail: { response: response?.response || '' },
                }),
            );
        } catch (err) {
            console.error('Error creating new chat:', err);
        }
    }

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

    const renderNavButtons = (isMobile = false) => {
        const itemsToRender = [...navigationItems];
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
                            startNewChat();
                            setActiveItem('Chat');
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
            {/* --- Desktop Sidebar --- */}
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

                {/* History Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top nav */}
                    <div className="px-2 pt-2 space-y-0.5">
                        {renderNavButtons(false)}
                        {/* Divider after Training - only when expanded */}
                        {!isCollapsed && <div className="my-2 border-t border-gray-200"></div>}
                    </div>

                    {/* Scrollable History */}
                    <div className="flex-1 overflow-y-auto px-2">
                        {!isCollapsed && (
                            <div
                                className="sticky top-0 z-10 bg-white px-2 pt-3 pb-2 
                      text-xs font-semibold text-gray-500 uppercase"
                            >
                                History
                            </div>
                        )}

                        <div className="space-y-1 mt-1">
                            {loading && <p className="text-sm text-gray-400 px-3">Loading...</p>}
                            {!loading && sessions.length === 0 && <p className="text-sm text-gray-400 px-3">No history found</p>}
                            {sessions.map((session) => (
                                <button
                                    key={session._id}
                                    className={`w-full flex items-center h-9 px-3 rounded-md text-gray-700 
            hover:bg-gray-100 transition ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                >
                                    {!isCollapsed && <span className="truncate leading-tight">{session.title || 'Untitled Chat'}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isCollapsed && <div className="my-2 border-t border-gray-200"></div>}
                </div>

                {/* Bottom */}
                <div className="p-2 space-y-1">
                    {/* Settings */}
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('Settings')}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <IconSettings className="h-4 w-4" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Profile */}
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('Profile')}
                        title={isCollapsed ? 'Profile' : undefined}
                    >
                        <Image
                            src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                            alt="Profile picture"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    Profile
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>

            {/* --- Mobile Trigger Button --- */}
            <button className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow hover:bg-gray-100" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <TwoBarMenuIcon className="w-5 h-5 text-gray-700" />
            </button>
        </>
    );
}
