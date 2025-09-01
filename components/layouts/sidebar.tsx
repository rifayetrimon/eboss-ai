'use client';

import { Home, Search, FileText, History, Bot, Sparkles, Menu } from 'lucide-react';
import IconAdd from '../icon/ai/icon-add';
import IconSettings from '../icon/ai/icon-settings';
import { useState } from 'react';
import { useProfile } from '@/hook/user/useProfile';
import Image from 'next/image';
import IconSidebar from '../icon/ai/icon-sidebar';

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('home');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { data } = useProfile();

    const navigationItems = [
        { id: 'home', icon: Home, label: 'Home', href: '/' },
        { id: 'new-chat', icon: IconAdd, label: 'New Chat', href: '/chat/new' },
        { id: 'search', icon: Search, label: 'Search', href: '/search' },
        { id: 'files', icon: FileText, label: 'Files', href: '/files' },
        { id: 'history', icon: History, label: 'History', href: '/history' },
    ];

    return (
        <div className={`flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            {/* Header Section */}
            <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 bg-sidebar-primary/10 rounded-lg">
                        <Bot className="h-6 w-6 text-sidebar-primary" />
                        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-chart-1 animate-pulse" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h2 className="font-semibold text-sidebar-foreground">Eboss AI</h2>
                        </div>
                    )}
                </div>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto p-1 rounded-md hover:bg-sidebar-accent transition-colors">
                    <IconSidebar />
                </button>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 p-3 space-y-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                                activeItem === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                            } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                            onClick={() => setActiveItem(item.id)}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4" />
                            {!isCollapsed && item.label}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Section */}
            <div className="p-3 border-t border-sidebar-border">
                <div className="space-y-1">
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                            activeItem === 'settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                        } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('settings')}
                        title={isCollapsed ? 'Settings' : undefined}
                    >
                        <IconSettings className="h-4 w-4" />
                        {!isCollapsed && 'Settings'}
                    </button>
                    <button
                        className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                            activeItem === 'profile' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                        } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        onClick={() => setActiveItem('profile')}
                        title={isCollapsed ? 'Profile' : undefined}
                    >
                        <Image
                            src={data?.personal?.file_profile_url || '/assets/images/user-profile.jpeg'}
                            alt="Profile picture"
                            width={16}
                            height={16}
                            className="h-4 w-4 rounded-full object-cover"
                        />
                        {!isCollapsed && 'Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}
