'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiPaperclip, FiShare2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import IconArrowUp from '@/components/icon/ai/icon-uparrow';
import PinIcon from '@/components/icon/ai/icon-pin';
import { sendChatOrUpload } from '@/services/ai/chatApi';

interface ChatContentProps {
    userName?: string;
    isSidebarCollapsed: boolean;
}

export default function ChatContent({ userName = 'Handsome', isSidebarCollapsed }: ChatContentProps) {
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const attachmentInputRef = useRef<HTMLInputElement | null>(null);

    const handleSendMessage = async (message?: string) => {
        const userMessage = message ?? inputValue.trim();
        if (!userMessage && !file) return;

        setIsLoading(true);
        setInputValue('');

        let displayUserMessage = userMessage;
        if (file && !userMessage) {
            displayUserMessage = `📂 Uploaded: ${file.name}`;
        }

        if (displayUserMessage) {
            setConversation((prev) => [...prev, { role: 'user', text: displayUserMessage }]);
        }

        try {
            const data = await sendChatOrUpload({
                message: userMessage || undefined,
                file: file || undefined,
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const uploadedFile = event.target.files[0];
            setFile(uploadedFile);
            handleSendMessage(uploadedFile.name);
            event.target.value = '';
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
                    placeholder={file ? `Attached: ${file.name}` : 'Ask anything'}
                    rows={2}
                    className="flex-1 resize-none px-3 py-2 bg-transparent focus:outline-none text-sm"
                    onKeyDown={handleKeyDown}
                />
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-0">
                        <button
                            type="button"
                            onClick={() => attachmentInputRef.current?.click()}
                            className="inline-flex items-center justify-center gap-1 h-9 px-2 text-sm rounded-md text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <FiPaperclip className="w-4 h-4" />
                            Attachment
                        </button>
                        <input ref={attachmentInputRef} type="file" accept="image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileChange(e)} />
                    </div>

                    <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-black transition disabled:opacity-50" disabled={!inputValue.trim() && !file}>
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

            <div
                className="absolute inset-0 overflow-y-auto px-6"
                ref={chatContainerRef}
                style={{
                    top: '76px',
                    bottom: '84px',
                    paddingTop: '0px',
                    paddingBottom: '0px',
                }}
            >
                {!hasMessages ? (
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
                                <div className="px-4 py-2 rounded-md flex space-x-2">
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" style={{ animationDelay: '200ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0046FF] to-[#FF3B3F] animate-pulse" style={{ animationDelay: '400ms' }} />
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
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
