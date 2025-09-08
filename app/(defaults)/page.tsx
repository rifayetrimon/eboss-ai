'use client';

import Sidebar from '@/components/layouts/sidebar';
import { useProfile } from '@/hook/user/useProfile';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiPaperclip, FiPlus } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconArrowUp from '@/components/icon/ai/icon-uparrow';
import Header from '@/components/layouts/header';
import { sendChatOrUpload } from '@/services/ai/chatApi';

export default function Home() {
    const { data } = useProfile();
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showUploadMenu, setShowUploadMenu] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const uploadMenuRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async (message?: string) => {
        const userMessage = message ?? inputValue.trim();
        if (!userMessage && !file) return;

        setIsLoading(true);
        setInputValue('');

        // Show user message & file in UI
        if (userMessage) {
            setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);
        }
        if (file) {
            setConversation((prev) => [...prev, { role: 'user', text: `📂 Uploaded: ${file.name}` }]);
        }

        try {
            const data = await sendChatOrUpload({
                message: userMessage || undefined,
                file: file || undefined,
                category: file ? 'company_background' : undefined,
                session_id: localStorage.getItem('session_id') || 'default-session',
            });

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
            setFile(null);
        }
    };

    // For plus icon → only attach file, no API call
    const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setFile(event.target.files[0]);
            setShowUploadMenu(false);
        }
    };

    // For Train AI → attach file + call API immediately
    const handleTrainFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const trainFile = event.target.files[0];
            setFile(trainFile);

            setConversation((prev) => [...prev, { role: 'user', text: `🤖 Training AI with: ${trainFile.name}` }]);

            try {
                setIsLoading(true);
                const data = await sendChatOrUpload({
                    file: trainFile,
                    category: 'company_background',
                    session_id: localStorage.getItem('session_id') || 'default-session',
                });

                setConversation((prev) => [
                    ...prev,
                    {
                        role: 'gemini',
                        text: data?.data?.response || data?.message || 'Training completed, no response received.',
                    },
                ]);
            } catch (error) {
                setConversation((prev) => [...prev, { role: 'gemini', text: '⚠️ Training failed. Please try again.' }]);
            } finally {
                setIsLoading(false);
                setFile(null);
            }
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

    // Auto-scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    // Close upload menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
                setShowUploadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                {/* Top row: Plus + Textarea + Send */}
                <div className="flex gap-1">
                    {/* Upload menu */}
                    <div className="relative" ref={uploadMenuRef}>
                        <button
                            type="button"
                            onClick={() => setShowUploadMenu(!showUploadMenu)}
                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {showUploadMenu && (
                            <div className="absolute bottom-12 left-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
                                <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer text-sm">
                                    <FiPaperclip className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    <input type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileAttach} />
                                    Upload file
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={file ? `Attached: ${file.name}` : 'Ask anything'}
                        rows={2}
                        className="flex-1 resize-none px-3 py-2 bg-transparent focus:outline-none text-sm"
                        onKeyDown={handleKeyDown}
                    />

                    {/* Send button */}
                    <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-black transition disabled:opacity-50" disabled={!inputValue.trim() && !file}>
                        <IconArrowUp />
                    </button>
                </div>

                {/* Bottom row: Train button */}
                <div className="mt-2 flex justify-start">
                    <button
                        type="button"
                        onClick={() => document.getElementById('train-file-input')?.click()}
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <FiPlus className="w-4 h-4" />
                        Train AI
                    </button>
                    <input id="train-file-input" type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={handleTrainFileChange} />
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

            <div className="flex h-screen bg-background">
                <Sidebar onCollapseChange={setIsSidebarCollapsed} />
                <div className="flex-1 flex flex-col relative">
                    <Header isCollapsed={isSidebarCollapsed} />
                    <main className={`flex-1 overflow-y-auto mt-14 mb-14 p-6 ${hasMessages ? 'sm:pb-[calc(4rem+25px)] pb-[calc(4rem+25px)]' : ''}`} ref={chatContainerRef}>
                        {!hasMessages ? (
                            <div className="flex flex-col justify-center items-start h-full w-full max-w-3xl mx-auto px-6 sm:px-0">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 w-full">
                                    <h1 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] bg-clip-text text-transparent">
                                        Hi {data?.personal?.full_name || 'Handsome'},
                                        <br />
                                        What would you like to know?
                                    </h1>
                                </motion.div>
                                <motion.div key="initial-input" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full hidden sm:block">
                                    {InputBox}
                                </motion.div>
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {conversation.map((message, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                        <div className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            <div className={`mb-2 inline-block max-w-full break-words ${message.role === 'gemini' ? 'prose dark:prose-invert max-w-none' : ''}`}>
                                                {message.role === 'gemini' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown> : <p>{message.text}</p>}
                                            </div>
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
                        )}
                    </main>
                </div>
            </div>

            <motion.div
                key="bottom-input"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`
                    fixed bottom-0 bg-background p-4
                    ${hasMessages ? 'block' : 'block sm:hidden'}
                    left-0 right-0 w-full
                    sm:w-auto
                    ${isSidebarCollapsed ? 'sm:left-16' : 'sm:left-64'} sm:right-0
                `}
            >
                <div className="w-full max-w-3xl mx-auto">{InputBox}</div>
            </motion.div>
        </>
    );
}
