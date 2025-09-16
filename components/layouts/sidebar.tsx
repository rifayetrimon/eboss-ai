'use client';

import { Home, History, X, Plus, User, MessageSquare, GraduationCap } from 'lucide-react';
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

    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);

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

    async function startNewChat() {
        try {
            const response = await startNewChatSession();
            if (response?.session_id) {
                localStorage.setItem('session_id', response.session_id);
            }
            window.dispatchEvent(new CustomEvent('newChatStarted'));
        } catch (err) {
            console.error('Error creating new chat:', err);
        }
    }

    const navigationItems = [
        { id: 'Personality', icon: User, label: 'Personality' },
        { id: 'Chat', icon: MessageSquare, label: 'Chat' },
        { id: 'Training', icon: GraduationCap, label: 'Training' },
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
            {/* Desktop Sidebar */}
            <motion.div animate={{ width: isCollapsed ? 64 : 256 }} transition={{ duration: 0.4 }} className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between h-14 px-4">
                    <div
                        className="flex items-center justify-center min-w-[40px] min-h-[40px] w-10 h-10 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 flex-shrink-0"
                        onMouseEnter={() => setHoverApp(true)}
                        onMouseLeave={() => setHoverApp(false)}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed && hoverApp ? <IconSidebar size={20} className="text-blue-600" /> : <IconAiLogo className="h-6 w-6 text-blue-600" />}
                    </div>

                    {!isCollapsed && (
                        <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-md hover:bg-gray-100 transition">
                            <IconSidebar size={18} className="text-gray-600" />
                        </button>
                    )}
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-2 pt-2 space-y-0.5">{renderNavButtons(false)}</div>
                    {!isCollapsed && <div className="my-2 border-t border-gray-200"></div>}

                    <div className="flex-1 overflow-y-auto px-2">
                        {!isCollapsed && <div className="sticky top-0 z-10 bg-white px-2 pt-3 pb-2 text-xs font-semibold text-gray-500 uppercase">History</div>}

                        <div className="space-y-1 mt-1">
                            {loading && <p className="text-sm text-gray-400 px-3">Loading...</p>}
                            {!loading && sessions.length === 0 && <p className="text-sm text-gray-400 px-3">No history found</p>}
                            {sessions.map((session) => (
                                <button
                                    key={session._id}
                                    className={`w-full flex items-center h-9 px-3 rounded-md text-gray-700 hover:bg-gray-100 transition ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                    onClick={() => {
                                        localStorage.setItem('session_id', session.session_id);
                                        window.dispatchEvent(new CustomEvent('chatSessionSelected', { detail: session.session_id }));
                                        setActiveItem('Chat');
                                    }}
                                >
                                    {!isCollapsed && <span className="truncate leading-tight">{session.title || 'Untitled Chat'}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    {!isCollapsed && <div className="my-2 border-t border-gray-200"></div>}
                </div>

                <div className="p-2 space-y-1">
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('Settings')}
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

                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('Profile')}
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

            {/* Mobile Hamburger Button */}
            <button className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
                <TwoBarMenuIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Dimmed background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Sidebar content */}
                        <motion.div
                            ref={sidebarRef}
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between h-14 px-4 border-b flex-shrink-0">
                                <IconAiLogo className="h-6 w-6 text-blue-600" />
                                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-gray-100">
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Menu at top */}
                            <div className="px-2 py-3 flex-shrink-0">{renderNavButtons(true)}</div>

                            {/* Scrollable History */}
                            <div className="flex-1 overflow-y-auto px-2 py-2">
                                <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-1">History</div>
                                <div className="space-y-1">
                                    {loading && <p className="text-sm text-gray-400 px-3">Loading...</p>}
                                    {!loading && sessions.length === 0 && <p className="text-sm text-gray-400 px-3">No history found</p>}
                                    {sessions.map((session) => (
                                        <button
                                            key={session._id}
                                            className="w-full flex items-center h-9 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                localStorage.setItem('session_id', session.session_id);
                                                window.dispatchEvent(new CustomEvent('chatSessionSelected', { detail: session.session_id }));
                                                setActiveItem('Chat');
                                                setMobileOpen(false);
                                            }}
                                        >
                                            <span className="truncate">{session.title || 'Untitled Chat'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-2 border-t flex-shrink-0 space-y-1">
                                <button className="w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100" onClick={() => setActiveItem('Settings')}>
                                    <IconSettings className="h-4 w-4" />
                                    <span>Settings</span>
                                </button>
                                <button className="w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100" onClick={() => setActiveItem('Profile')}>
                                    <Image
                                        src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                                        alt="Profile picture"
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span>Profile</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
