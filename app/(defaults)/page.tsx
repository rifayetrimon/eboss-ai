'use client';

import Sidebar from '@/components/layouts/sidebar';
import { useProfile } from '@/hook/user/useProfile';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const { data } = useProfile();
    const [messages, setMessages] = useState<string[]>([]);

    const handleSend = () => {
        const input = document.getElementById('chat-input') as HTMLTextAreaElement;
        if (input && input.value.trim()) {
            setMessages([...messages, input.value.trim()]);
            input.value = '';
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            {/* Main chat container */}
            <main className="flex-1 flex flex-col p-6">
                {!hasMessages ? (
                    // Centered layout for initial state
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Centered greeting */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
                            <h1 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] bg-clip-text text-transparent">
                                Hi there, {data?.personal?.full_name || 'Handsome'}
                                <br />
                                What would you like to know?
                            </h1>
                        </motion.div>

                        {/* Centered input field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full max-w-3xl border border-border rounded-lg p-2 shadow-sm relative"
                        >
                            {/* 📎 Attachment Button */}
                            <button className="absolute bottom-2 left-2 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <div className="h-8 w-8 flex items-center justify-center rounded-full border border-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="hidden sm:inline text-xs">Add attachment</span>
                            </button>

                            {/* 📝 Text Area */}
                            <textarea
                                id="chat-input"
                                placeholder="Ask whatever you want..."
                                rows={2}
                                className="flex-1 w-full resize-none pl-12 pr-12 py-3 focus:outline-none bg-transparent"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />

                            {/* 📤 Send Button */}
                            <button onClick={handleSend} className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    // Chat layout with messages
                    <>
                        {/* Chat messages area */}
                        <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto mb-6">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-3 bg-muted rounded-lg max-w-md">
                                        {msg}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom input field */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-3xl mx-auto border border-border rounded-lg p-2 shadow-sm relative"
                        >
                            {/* 📎 Attachment Button */}
                            <button className="absolute bottom-2 left-2 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <div className="h-8 w-8 flex items-center justify-center rounded-full border border-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="hidden sm:inline text-xs">Add attachment</span>
                            </button>

                            {/* 📝 Text Area */}
                            <textarea
                                id="chat-input"
                                placeholder="Ask whatever you want..."
                                rows={2}
                                className="flex-1 w-full resize-none pl-12 pr-12 py-3 focus:outline-none bg-transparent"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />

                            {/* 📤 Send Button */}
                            <button onClick={handleSend} className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </motion.div>
                    </>
                )}
            </main>
        </div>
    );
}
