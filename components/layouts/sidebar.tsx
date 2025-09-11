'use client';

import { Home, Search, FileText, History, X } from 'lucide-react';
import IconAdd from '../icon/ai/icon-add';
import IconSettings from '../icon/ai/icon-settings';
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hook/user/useProfile';
import Image from 'next/image';
import IconSidebar from '../icon/ai/icon-sidebar';
import TwoBarMenuIcon from '../icon/ai/icon-twobar';
import IconAiLogo from '../icon/ai/icon-ai-logo';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const [activeItem, setActiveItem] = useState('home');
    const [isCollapsed, setIsCollapsed] = useState(false); // desktop
    const [hoverApp, setHoverApp] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false); // mobile
    const { data } = useProfile();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navigationItems = [
        { id: 'new-chat', icon: IconAdd, label: 'New Chat', href: '/chat/new' },
        { id: 'home', icon: Home, label: 'Home', href: '/' },
        { id: 'files', icon: FileText, label: 'Files', href: '/files' },
        { id: 'history', icon: History, label: 'History', href: '/history' },
    ];

    // Notify parent when collapsed changes
    useEffect(() => {
        if (onCollapseChange) onCollapseChange(isCollapsed);
    }, [isCollapsed, onCollapseChange]);

    // Close sidebar when clicking outside (mobile)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileOpen]);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-30 flex items-center px-4">
                <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 p-2 rounded-md transition-all duration-300 hover:bg-gray-100" aria-label="Open menu">
                    <TwoBarMenuIcon className="h-5 w-5 text-gray-800" />
                    <span className="font-semibold text-gray-800">Eboss AI</span>
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 bg-black z-40 md:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence mode="wait">
                {mobileOpen && (
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white border-r border-gray-200 shadow-xl z-50 md:hidden"
                    >
                        {/* Mobile Header */}
                        <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="search chat..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sidebar-primary/30 focus:border-sidebar-primary"
                                />
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Close menu">
                                <X size={16} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 px-2 pt-2 space-y-0.5">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-gray-700 transition-all duration-200 
                                            hover:bg-gray-100 hover:translate-x-1
                                            ${activeItem === item.id ? 'bg-gray-200 font-medium' : ''}`}
                                        onClick={() => {
                                            setActiveItem(item.id);
                                            setMobileOpen(false);
                                        }}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                            {item.label}
                                        </motion.span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Bottom Section */}
                        <div className="p-2 space-y-1">
                            <button
                                className="w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100"
                                onClick={() => {
                                    setActiveItem('settings');
                                    setMobileOpen(false);
                                }}
                            >
                                <IconSettings className="h-4 w-4 flex-shrink-0" />
                                <span>Settings</span>
                            </button>
                            <button
                                className="w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100"
                                onClick={() => {
                                    setActiveItem('profile');
                                    setMobileOpen(false);
                                }}
                            >
                                <Image
                                    src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                                    alt="Profile picture"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover flex-shrink-0 min-w-[32px] min-h-[32px]"
                                />
                                <span>Profile</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                animate={{ width: isCollapsed ? 64 : 256 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="hidden md:flex flex-col h-screen bg-white border-r border-gray-200 overflow-hidden"
            >
                {/* Header */}
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
                        <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-md hover:bg-gray-100 transition" aria-label="Collapse sidebar">
                            <IconSidebar size={18} className="text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <div className="flex-1 px-2 pt-2 space-y-0.5">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-gray-700 transition-all duration-200
                                    hover:bg-gray-100 hover:translate-x-1
                                    ${activeItem === item.id ? 'bg-gray-200 font-medium' : ''}
                                    ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                onClick={() => setActiveItem(item.id)}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />

                                {/* Animate text fade in/out */}
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="whitespace-nowrap">
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Bottom */}
                <div className="p-2 space-y-1">
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100
                            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('settings')}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <IconSettings className="h-4 w-4 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md hover:bg-gray-100
                            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('profile')}
                        title={isCollapsed ? 'Profile' : undefined}
                    >
                        <Image
                            src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                            alt="Profile picture"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0 min-w-[32px] min-h-[32px]"
                        />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    Profile
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>
        </>
    );
}
