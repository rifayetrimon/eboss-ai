'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiShare2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconArrowUp from '@/components/icon/ai/icon-uparrow';
import PinIcon from '@/components/icon/ai/icon-pin';
import { sendChatWithResources, fetchChatSession } from '@/services/ai/chatApi';
import { fetchChatSessions } from '@/services/ai/sidebar';
import Loading from '../layouts/loading';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

interface ChatContentProps {
    userName?: string;
    isSidebarCollapsed: boolean;
}

export default function ChatContent({ userName = 'User', isSidebarCollapsed }: ChatContentProps) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // ✅ Get current chat level from Redux
    const chatLevel = useSelector((state: IRootState) => state.chat.chatLevel);

    // ✅ Track current level for immediate use after dropdown changes
    const [currentLevel, setCurrentLevel] = useState(chatLevel);

    // ✅ Listen for chat level changes from header dropdown
    useEffect(() => {
        const handleChatLevelChange = (event: CustomEvent) => {
            const { newLevel } = event.detail;
            setCurrentLevel(newLevel);
            console.log('📢 Chat component received level change:', newLevel);
        };

        window.addEventListener('chatLevelChanged', handleChatLevelChange as EventListener);
        return () => window.removeEventListener('chatLevelChanged', handleChatLevelChange as EventListener);
    }, []);

    // ✅ Sync with Redux state changes
    useEffect(() => {
        setCurrentLevel(chatLevel);
        console.log('🔍 Chat component: Redux chatLevel updated to:', chatLevel);
    }, [chatLevel]);

    // ✅ Load conversation logic (unchanged)
    const loadConversation = async (sessionId?: string) => {
        const targetSessionId = sessionId || localStorage.getItem('session_id');
        const savedConversation = localStorage.getItem('chat_conversation');

        if (savedConversation) {
            try {
                const parsedConversation = JSON.parse(savedConversation);
                if (Array.isArray(parsedConversation) && parsedConversation.length > 0) {
                    setConversation(parsedConversation);
                }
            } catch (err) {
                console.error('❌ Failed to parse saved conversation:', err);
            }
        }

        if (!targetSessionId) return;
        setIsLoadingHistory(true);

        try {
            const data = await fetchChatSession(targetSessionId);
            let messages: any[] = [];

            if (data?.data?.messages) messages = data.data.messages;
            else if (data?.messages) messages = data.messages;
            else if (Array.isArray(data?.data)) messages = data.data;

            if (messages.length > 0) {
                const formattedMessages = messages.map((msg: any) => ({
                    role: msg.role === 'assistant' || msg.role === 'ai' || msg.role === 'gemini' ? 'gemini' : 'user',
                    text: msg.content || msg.text || msg.message || '',
                }));
                setConversation(formattedMessages);
                localStorage.setItem('chat_conversation', JSON.stringify(formattedMessages));
            } else {
                setConversation([]);
                localStorage.removeItem('chat_conversation');
            }
        } catch (err) {
            console.error('❌ Failed to fetch chat session:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // ✅ Function to refresh sidebar sessions
    const refreshSidebarSessions = async () => {
        try {
            const sessions = await fetchChatSessions();
            // Dispatch event to update sidebar with fresh sessions
            window.dispatchEvent(new CustomEvent('chatSessionsUpdated', { detail: sessions }));
        } catch (error) {
            console.error('❌ Failed to refresh sidebar sessions:', error);
        }
    };

    useEffect(() => {
        loadConversation();
    }, []);

    useEffect(() => {
        const handleChatSessionSelected = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            setConversation([]);
            loadConversation(customEvent.detail);
        };
        window.addEventListener('chatSessionSelected', handleChatSessionSelected);
        return () => window.removeEventListener('chatSessionSelected', handleChatSessionSelected);
    }, []);

    useEffect(() => {
        if (conversation.length > 0) {
            localStorage.setItem('chat_conversation', JSON.stringify(conversation));
        }
    }, [conversation]);

    useEffect(() => {
        const resetChat = () => {
            setConversation([]);
            setInputValue('');
            localStorage.removeItem('chat_conversation');
            localStorage.removeItem('session_id');
        };
        window.addEventListener('newChatStarted', resetChat);
        return () => window.removeEventListener('newChatStarted', resetChat);
    }, []);

    // ✅ Fixed handleSendMessage to use current level
    const handleSendMessage = async (message?: string) => {
        const userMessage = message ?? inputValue.trim();
        if (!userMessage) return;

        const isFirstMessage = conversation.length === 0; // Track if this is the first message

        setIsLoading(true);
        setInputValue('');
        setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);

        try {
            const sessionId = localStorage.getItem('session_id') || '';

            console.log('🚀 Sending message with level:', currentLevel);

            // ✅ Use currentLevel instead of hardcoded 'public'
            const data = await sendChatWithResources({
                message: userMessage,
                session_id: sessionId,
                level: currentLevel, // ✅ This now uses the dropdown selection
                max_results: 5,
                include_metadata: false,
            });

            const aiResponse = {
                role: 'gemini',
                text: data?.data?.response || data?.response || data?.message || 'No response from AI.',
            };
            setConversation((prev) => [...prev, aiResponse]);

            // ✅ Handle new session creation
            if (data?.data?.session_id) {
                const newSessionId = data.data.session_id;
                const currentSessionId = localStorage.getItem('session_id');

                localStorage.setItem('session_id', newSessionId);

                // ✅ If this was the first message or session changed, refresh sidebar
                if (isFirstMessage || currentSessionId !== newSessionId) {
                    // Add a small delay to ensure the session is properly saved on backend
                    setTimeout(() => {
                        refreshSidebarSessions();
                    }, 500);
                }
            }
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

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const toggleLike = (index: number) => {
        setLikedIndex(likedIndex === index ? null : index);
        if (dislikedIndex === index) setDislikedIndex(null);
    };

    const toggleDislike = (index: number) => {
        setDislikedIndex(dislikedIndex === index ? null : index);
        if (likedIndex === index) setLikedIndex(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ✅ Keep messages above input field
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <div className="mt-2 flex items-center justify-end">
                    <button
                        type="submit"
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-black transition disabled:opacity-50"
                        disabled={!inputValue.trim() || isLoading}
                    >
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

            {/* Chat area leaves gap above input */}
            <div
                className="absolute inset-0 overflow-y-auto px-6"
                ref={chatContainerRef}
                style={{
                    top: '74px',
                    bottom: '104px', // input height + gap
                    paddingTop: '30px',
                    paddingBottom: '20px',
                }}
            >
                {isLoadingHistory && <Loading />}

                {!hasMessages && !isLoadingHistory ? (
                    <div className="flex flex-col justify-center items-start h-full w-full max-w-3xl mx-auto px-6 sm:px-0">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 w-full">
                            <h1 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] bg-clip-text text-transparent">
                                Hi {userName},
                                <br />
                                What would you like to know?
                            </h1>
                        </motion.div>
                        <motion.div key="initial-input" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full hidden sm:block">
                            {InputBox}
                        </motion.div>
                    </div>
                ) : hasMessages ? (
                    <div className="space-y-6 max-w-3xl mx-auto pb-5">
                        {conversation.map((message, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <div className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {message.role === 'gemini' ? (
                                        // ✅ AI message with gray background and padding
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-2">
                                            <div className="prose dark:prose-invert max-w-none prose-sm">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        // Custom styling for markdown elements
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4">{children}</ul>,
                                                        ol: ({ children }) => <ol className="mb-2 last:mb-0 pl-4">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                                        h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                                        h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                                                        code: ({ children, className }) => {
                                                            const isInline = !className?.includes('language-');
                                                            return isInline ? (
                                                                <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                                            ) : (
                                                                <code className={className}>{children}</code>
                                                            );
                                                        },
                                                        pre: ({ children }) => <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto text-xs">{children}</pre>,
                                                        blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic">{children}</blockquote>,
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ) : (
                                        // ✅ User message without background
                                        <div className="mb-2">
                                            <p className="inline-block max-w-full break-words">{message.text}</p>
                                        </div>
                                    )}

                                    {message.role === 'gemini' && (
                                        <div className="flex mt-2 space-x-3">
                                            <button onClick={() => handleCopy(message.text, index)} className="hover:scale-110 transition">
                                                <FiCopy
                                                    size={14}
                                                    className={copiedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                    style={copiedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
                                                />
                                            </button>
                                            <button onClick={() => toggleLike(index)} className="hover:scale-110 transition">
                                                <FiThumbsUp
                                                    size={14}
                                                    className={likedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                    style={likedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
                                                />
                                            </button>
                                            <button onClick={() => toggleDislike(index)} className="hover:scale-110 transition">
                                                <FiThumbsDown
                                                    size={14}
                                                    className={dislikedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                    style={dislikedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
                                                />
                                            </button>
                                            <button onClick={() => console.log('Share clicked', message.text)} className="hover:scale-110 transition">
                                                <FiShare2 size={14} className="text-black dark:text-white" />
                                            </button>
                                            <button onClick={() => console.log('Pin clicked', message.text)} className="hover:scale-110 transition">
                                                <PinIcon size={14} className="text-black dark:text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {index < conversation.length - 1 && <hr className="my-4 border-gray-100 dark:border-gray-800" />}
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-2 mt-2">
                                <div className="dark:bg-gray-800 rounded-xl p-4">
                                    <div className="flex space-x-2">
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" />
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" style={{ animationDelay: '200ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" style={{ animationDelay: '400ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Fixed input centered at bottom */}
            <motion.div
                key="bottom-input"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed bottom-0 bg-background p-4 z-40 ${hasMessages ? 'block' : 'block sm:hidden'} ${isSidebarCollapsed ? 'md:left-16' : 'md:left-64'} left-0 right-0`}
            >
                <div className="w-full max-w-3xl mx-auto">{InputBox}</div>
            </motion.div>
        </>
    );
}
