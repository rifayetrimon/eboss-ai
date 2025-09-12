'use client';

import { useState } from 'react';
import Sidebar from '@/components/layouts/sidebar';
import Header from '@/components/layouts/header';
import ChatContent from '@/components/pages/Chat-component';
import PersonalContent from '@/components/pages/Personal-component';
import TrainingContent from '@/components/pages/Training-component';
import { useProfile } from '@/hook/user/useProfile';
import { motion } from 'framer-motion';

export default function HomePage() {
    const [activeItem, setActiveItem] = useState('Chat');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { data } = useProfile();
    const userName = data?.personal?.full_name || 'Handsome';

    const renderContent = () => {
        switch (activeItem) {
            case 'Personality':
                return <PersonalContent />;
            case 'Training':
                return <TrainingContent />;
            case 'Chat':
            default:
                return (
                    <motion.div key="chat-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
                        <ChatContent userName={userName} isSidebarCollapsed={isSidebarCollapsed} />
                    </motion.div>
                );
        }
    };

    return (
        <>
            {/* Gradient Def */}
            <svg width="0" height="0">
                <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0046FF" />
                    <stop offset="100%" stopColor="#FF3B3F" />
                </linearGradient>
            </svg>

            <div className="flex h-screen bg-background">
                {/* Sidebar */}
                <Sidebar onCollapseChange={setIsSidebarCollapsed} activeItem={activeItem} setActiveItem={setActiveItem} />

                {/* Main area */}
                <div className="flex-1 flex flex-col relative">
                    {/* ✅ Pass activeItem into Header */}
                    <Header isCollapsed={isSidebarCollapsed} activeItem={activeItem} />

                    <main className={`flex-1 overflow-y-auto ${activeItem === 'Chat' ? 'p-0' : 'p-6'}`}>{renderContent()}</main>
                </div>
            </div>
        </>
    );
}
