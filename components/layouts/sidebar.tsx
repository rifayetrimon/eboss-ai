'use client';

import { Home, Search, FileText, History, Bot, Sparkles, X } from 'lucide-react';
import IconAdd from '../icon/ai/icon-add';
import IconSettings from '../icon/ai/icon-settings';
import { useState, useEffect, useRef } from 'react';
import { useProfile } from '@/hook/user/useProfile';
import Image from 'next/image';
import IconSidebar from '../icon/ai/icon-sidebar';
import TwoBarMenuIcon from '../icon/ai/icon-twobar';

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('home');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hoverApp, setHoverApp] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data } = useProfile();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const navigationItems = [
        { id: 'new-chat', icon: IconAdd, label: 'New Chat', href: '/chat/new' },
        { id: 'home', icon: Home, label: 'Home', href: '/' },
        { id: 'files', icon: FileText, label: 'Files', href: '/files' },
        { id: 'history', icon: History, label: 'History', href: '/history' },
    ];

    // Handle sidebar transitions
    useEffect(() => {
        if (mobileOpen) {
            setIsTransitioning(true);
        } else {
            const timer = setTimeout(() => setIsTransitioning(false), 300);
            return () => clearTimeout(timer);
        }
    }, [mobileOpen]);

    // Close sidebar when clicking outside on mobile
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
            {/* Mobile Header Bar - Always visible */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-30 flex items-center px-4">
                <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 p-2 rounded-md transition-all duration-300 hover:bg-gray-100" aria-label="Open menu">
                    <TwoBarMenuIcon className="h-5 w-5 text-gray-800" />
                    <span className="font-semibold text-gray-800">Eboss AI</span>
                </button>
            </div>

            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`
                    fixed md:relative top-0 left-0 h-screen flex flex-col bg-white md:bg-sidebar border-r border-sidebar-border
                    transition-all duration-300 ease-out overflow-hidden z-50
                    ${isCollapsed ? 'w-16' : 'w-64'}
                    ${mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
                    ${isTransitioning ? '' : 'md:!transition-all'}
                `}
                style={{
                    transitionProperty: 'transform, width, box-shadow',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Mobile Search Header */}
                <div className="md:hidden flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="search chat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sidebar-primary/30 focus:border-sidebar-primary"
                        />
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Close menu">
                        <X size={16} className="text-gray-600" />
                    </button>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center gap-3 p-4 border-b border-sidebar-border">
                    <div
                        className="relative flex items-center justify-center w-10 h-10 bg-sidebar-primary/10 rounded-lg cursor-pointer transition-all duration-200 hover:bg-sidebar-primary/20"
                        onMouseEnter={() => setHoverApp(true)}
                        onMouseLeave={() => setHoverApp(false)}
                        onClick={() => {
                            setIsCollapsed(!isCollapsed);
                            if (isCollapsed) setMobileOpen(false);
                        }}
                    >
                        {isCollapsed && hoverApp ? (
                            <IconSidebar size={20} className="text-sidebar-primary transition-opacity duration-200" />
                        ) : (
                            <>
                                <Bot className="h-6 w-6 text-sidebar-primary transition-transform duration-200" />
                                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-chart-1 animate-pulse" />
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="overflow-hidden transition-all duration-300">
                            <h2 className="font-semibold text-sidebar-foreground whitespace-nowrap">Eboss AI</h2>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent transition-all duration-200 hover:scale-105"
                            aria-label="Collapse sidebar"
                        >
                            <IconSidebar size={18} className="text-sidebar-foreground" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 px-2 pt-2 space-y-0.5">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground transition-all duration-200 
                                    hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1
                                    ${activeItem === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                                `}
                                onClick={() => {
                                    setActiveItem(item.id);
                                    setMobileOpen(false);
                                }}
                                style={{ transitionDelay: `${index * 30}ms` }}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-200">{item.label}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="p-2 border-t border-sidebar-border">
                    <div className="space-y-1">
                        <button
                            className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground transition-all duration-200 
                                hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1
                                ${activeItem === 'settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                                ${isCollapsed ? 'justify-center' : 'justify-start'}
                            `}
                            onClick={() => {
                                setActiveItem('settings');
                                setMobileOpen(false);
                            }}
                            title={isCollapsed ? 'Settings' : undefined}
                        >
                            <IconSettings className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && 'Settings'}
                        </button>

                        <button
                            className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground transition-all duration-200 
                                hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1
                                ${activeItem === 'profile' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                                ${isCollapsed ? 'justify-center' : 'justify-start'}
                            `}
                            onClick={() => {
                                setActiveItem('profile');
                                setMobileOpen(false);
                            }}
                            title={isCollapsed ? 'Profile' : undefined}
                        >
                            <Image
                                src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                                alt="Profile picture"
                                width={32}
                                height={32}
                                className="h-8 w-8 rounded-full object-cover flex-shrink-0 transition-transform duration-200 hover:scale-105"
                            />
                            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">Profile</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
