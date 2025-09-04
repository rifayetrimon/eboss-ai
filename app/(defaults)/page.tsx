'use client';

import Sidebar from '@/components/layouts/sidebar';
import { useProfile } from '@/hook/user/useProfile';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { basePath } from '@/next.config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconArrowUp from '@/components/icon/ai/icon-uparrow';
import Header from '@/components/layouts/header';

export default function Home() {
    const { data } = useProfile();
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async (message?: string) => {
        const userMessage = message ?? inputValue.trim();
        if (!userMessage) return;

        setIsLoading(true);
        setInputValue('');
        setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);

        try {
            const response = await fetch(`${basePath}/apps/api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to get response');

            setConversation((prev) => [...prev, { role: 'gemini', text: data.text || data.message || 'No response from AI.' }]);
        } catch (error: any) {
            let errorMessage = 'Sorry, something went wrong. Please try again.';
            if (error.message?.includes('API key')) {
                errorMessage = '⚠️ Invalid API key. Please check your GEMINI_API_KEY in .env.local.';
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

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const hasMessages = conversation.length > 0;

    // Input component (reusable for desktop + mobile)
    const InputBox = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}
            className="relative w-full"
        >
            <div
                className="
                    flex items-center bg-white dark:bg-muted
                    rounded-full shadow-md border border-gray-200 dark:border-border
                    px-4 py-2
                    w-full
                "
            >
                {/* Plus Button */}
                <button type="button" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

                {/* Textarea */}
                <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything"
                    rows={1}
                    className="flex-1 resize-none px-3 py-2 bg-transparent focus:outline-none text-sm"
                    onKeyDown={handleKeyDown}
                />

                {/* Send Button */}
                <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-black transition">
                    <IconArrowUp />
                </button>
            </div>
        </form>
    );

    return (
        <>
            {/* Gradient Defs */}
            <svg width="0" height="0">
                <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0046FF" />
                    <stop offset="100%" stopColor="#FF3B3F" />
                </linearGradient>
            </svg>

            <div className="flex h-screen bg-background">
                <Sidebar onCollapseChange={setIsSidebarCollapsed} />
                <Header isCollapsed={isSidebarCollapsed} />

                {/* Main chat container */}
                <main className="flex-1 flex flex-col p-6 relative">
                    {!hasMessages ? (
                        <>
                            {/* Centered h1 */}
                            <div className="flex-1 flex flex-col justify-center items-center">
                                <div className="w-full max-w-3xl text-left">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
                                        <h1 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] bg-clip-text text-transparent">
                                            Hi {data?.personal?.full_name || 'Handsome'},
                                            <br />
                                            What would you like to know?
                                        </h1>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Desktop Input */}
                            <div className="hidden sm:block w-full max-w-3xl mx-auto mt-auto sm:mt-8">{InputBox}</div>
                        </>
                    ) : (
                        // Chat state with messages
                        <>
                            {/* Chat messages area */}
                            <div ref={chatContainerRef} className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto pb-20">
                                <div className="space-y-6">
                                    {conversation.map((message, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                            <div className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                <div className={`mb-2 inline-block max-w-full break-words ${message.role === 'gemini' ? 'prose dark:prose-invert max-w-none' : ''}`}>
                                                    {message.role === 'gemini' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown> : <p>{message.text}</p>}
                                                </div>

                                                {message.role === 'gemini' && (
                                                    <div className="flex mt-2 space-x-3">
                                                        {/* Copy */}
                                                        <button onClick={() => handleCopy(message.text, index)} className="hover:scale-110 transition">
                                                            <FiCopy
                                                                size={14}
                                                                className={copiedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                                style={
                                                                    copiedIndex === index
                                                                        ? {
                                                                              stroke: 'url(#pinkRedGradient)',
                                                                          }
                                                                        : {}
                                                                }
                                                            />
                                                        </button>

                                                        {/* Like */}
                                                        <button onClick={() => toggleLike(index)} className="hover:scale-110 transition">
                                                            <FiThumbsUp
                                                                size={14}
                                                                className={likedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                                style={
                                                                    likedIndex === index
                                                                        ? {
                                                                              stroke: 'url(#pinkRedGradient)',
                                                                          }
                                                                        : {}
                                                                }
                                                            />
                                                        </button>

                                                        {/* Dislike */}
                                                        <button onClick={() => toggleDislike(index)} className="hover:scale-110 transition">
                                                            <FiThumbsDown
                                                                size={14}
                                                                className={dislikedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                                style={
                                                                    dislikedIndex === index
                                                                        ? {
                                                                              stroke: 'url(#pinkRedGradient)',
                                                                          }
                                                                        : {}
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {index < conversation.length - 1 && <hr className="my-4 border-gray-100 dark:border-gray-800" />}
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground mt-2">
                                            Thinking...
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Desktop Input */}
                            <div className="hidden sm:block w-full max-w-3xl mx-auto mt-auto">{InputBox}</div>
                        </>
                    )}
                </main>
            </div>

            {/* Mobile input fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-gray-200 dark:border-gray-800 sm:hidden">
                <div className="w-full max-w-3xl mx-auto">{InputBox}</div>
            </div>
        </>
    );
}
