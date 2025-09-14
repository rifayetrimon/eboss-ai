// ✅ ChatContent.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiShare2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconArrowUp from '@/components/icon/ai/icon-uparrow';
import PinIcon from '@/components/icon/ai/icon-pin';
import { sendChatWithResources } from '@/services/ai/chatApi';

interface ChatContentProps {
    userName?: string;
    isSidebarCollapsed: boolean;
}

export default function ChatContent({ userName = 'Handsome', isSidebarCollapsed }: ChatContentProps) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // ✅ Reset chat when Sidebar triggers "newChatStarted"
    useEffect(() => {
        const resetChat = () => {
            setConversation([]);
            setInputValue('');
        };
        window.addEventListener('newChatStarted', resetChat);
        return () => window.removeEventListener('newChatStarted', resetChat);
    }, []);

    const handleSendMessage = async (message?: string) => {
        const userMessage = message ?? inputValue.trim();
        if (!userMessage) return;

        setIsLoading(true);
        setInputValue('');

        // Show user message
        setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);

        try {
            const data = await sendChatWithResources({
                message: userMessage,
                session_id: localStorage.getItem('chat_session_id') || '',
                level: 'public',
                max_results: 5,
                include_metadata: false,
            });

            // Append AI response
            setConversation((prev) => [
                ...prev,
                {
                    role: 'gemini',
                    text: data?.data?.response || data?.message || 'No response from AI.',
                },
            ]);
        } catch (error: any) {
            let errorMessage = 'Sorry, something went wrong. Please try again.';
            if (error.message?.includes('Encrypted key missing')) {
                errorMessage = '⚠️ Encrypted key missing. Please login again.';
            }
            setConversation((prev) => [...prev, { role: 'gemini', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Auto-scroll to bottom but leave 20px gap
    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            const targetScroll = container.scrollHeight - 20;
            container.scrollTop = targetScroll > 0 ? targetScroll : 0;
        }
    }, [conversation]);

    const hasMessages = conversation.length > 0;

    const InputBox = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}
            className="relative w-full"
        >
            <div className="flex flex-col bg-white dark:bg-muted rounded-lg shadow-md border border-gray-200 dark:border-border px-4 py-2 w-full relative">
                <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything"
                    rows={2}
                    className="flex-1 resize-none px-3 py-2 bg-transparent focus:outline-none text-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <div className="mt-2 flex items-center justify-end">
                    <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-black transition disabled:opacity-50" disabled={!inputValue.trim()}>
                        <IconArrowUp />
                    </button>
                </div>
            </div>
        </form>
    );

    return (
        <>
            <svg width="0" height="0">
                <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0046FF" />
                    <stop offset="100%" stopColor="#FF3B3F" />
                </linearGradient>
            </svg>

            {/* Chat Area */}
            <div
                className="absolute inset-0 overflow-y-auto px-6"
                ref={chatContainerRef}
                style={{
                    top: '76px',
                    bottom: '104px', // 84px input + 20px gap
                }}
            >
                {/* ... keep your chat rendering code here ... */}
            </div>

            {/* Bottom input fixed bar */}
            <motion.div
                key="bottom-input"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`
                    fixed bottom-0 bg-background p-4 z-40
                    ${hasMessages ? 'block' : 'block sm:hidden'}
                    ${isSidebarCollapsed ? 'md:left-16' : 'md:left-64'} 
                    left-0 right-0 md:right-0
                `}
            >
                <div className="w-full max-w-3xl mx-auto">{InputBox}</div>
            </motion.div>
        </>
    );
}
