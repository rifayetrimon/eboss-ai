'use client';

import Sidebar from '@/components/layouts/sidebar';
import { useProfile } from '@/hook/user/useProfile';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { basePath } from '@/next.config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const animatedBorderStyle = `
.animated-border-button {
  position: relative;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  box-shadow: 0 0 5px rgba(0, 70, 255, 0.3), 0 0 10px rgba(255, 59, 63, 0.3);
}

.dark .animated-border-button {
  border-color: #4b5563;
  background-color: #1f2937;
}

.animated-border-button::before {
  content: '';
  position: absolute;
  top: -200%;
  left: -200%;
  width: 500%;
  height: 500%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    transparent 35%,
    #0046FF 35%,
    #FF3B3F 65%,
    transparent 65%,
    transparent 100%
  );
  animation: rotateConic 3s linear infinite;
  z-index: 0;
}

.animated-border-button::after {
  content: '';
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  background-color: #f3f4f6;
  border-radius: inherit;
  z-index: 1;
}

.dark .animated-border-button::after {
  background-color: #1f2937;
}

.animated-border-button > span {
  position: relative;
  z-index: 2;
  background-color: transparent;
  display: block;
  padding: 0.75rem 1rem;
}

@keyframes rotateConic {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default function Home() {
    const { data } = useProfile();
    const suggestions = ["What's Eboss?", 'How do I sign up for Eboss?'];
    const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [likedIndex, setLikedIndex] = useState<number | null>(null);
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const toggleHelpMenu = () => setIsHelpMenuOpen(!isHelpMenuOpen);

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

    return (
        <>
            <style jsx global>
                {animatedBorderStyle}
            </style>

            {/* Gradient Defs */}
            <svg width="0" height="0">
                <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0046FF" />
                    <stop offset="100%" stopColor="#FF3B3F" />
                </linearGradient>
            </svg>

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

                            {/* Suggestion buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-xl"
                            >
                                <button
                                    className="w-full text-gray-900 dark:text-gray-100 text-left transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 animated-border-button"
                                    onClick={() => handleSendMessage(suggestions[0])}
                                >
                                    <span>{suggestions[0]}</span>
                                </button>
                                <button
                                    className="w-full px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-left py-3 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    onClick={() => handleSendMessage(suggestions[1])}
                                >
                                    {suggestions[1]}
                                </button>
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
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask whatever you want..."
                                    rows={2}
                                    className="flex-1 w-full resize-none pl-12 pr-12 py-3 focus:outline-none bg-transparent"
                                    onKeyDown={handleKeyDown}
                                />

                                {/* 📤 Send Button */}
                                <button
                                    onClick={() => handleSendMessage()}
                                    className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
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
                            <div ref={chatContainerRef} className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto mb-6">
                                <div className="space-y-4">
                                    {conversation.map((message, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                            <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                <div
                                                    className={`mb-2 inline-block px-4 py-2 rounded-lg max-w-full break-words ${
                                                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                                                    } ${message.role === 'gemini' ? 'prose dark:prose-invert max-w-none' : ''}`}
                                                >
                                                    {message.role === 'gemini' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown> : message.text}
                                                </div>

                                                {message.role === 'gemini' && (
                                                    <div className="flex mt-2 space-x-3">
                                                        {/* Copy */}
                                                        <button onClick={() => handleCopy(message.text, index)} className="hover:scale-110 transition">
                                                            <FiCopy
                                                                size={14}
                                                                className={copiedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                                style={copiedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
                                                            />
                                                        </button>

                                                        {/* Like */}
                                                        <button onClick={() => toggleLike(index)} className="hover:scale-110 transition">
                                                            <FiThumbsUp
                                                                size={14}
                                                                className={likedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
                                                                style={likedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
                                                            />
                                                        </button>

                                                        {/* Dislike */}
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
                            </div>

                            {/* Bottom input field */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-3xl mx-auto">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="relative w-full mb-4"
                                >
                                    <div className="border border-border rounded-lg p-2 shadow-sm relative">
                                        {/* 📎 Attachment Button */}
                                        <button type="button" className="absolute bottom-2 left-2 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                            <div className="h-8 w-8 flex items-center justify-center rounded-full border border-muted-foreground">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <span className="hidden sm:inline text-xs">Add attachment</span>
                                        </button>

                                        {/* 📝 Text Area */}
                                        <textarea
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Ask whatever you want..."
                                            rows={2}
                                            className="flex-1 w-full resize-none pl-12 pr-12 py-3 focus:outline-none bg-transparent"
                                            onKeyDown={handleKeyDown}
                                        />

                                        {/* 📤 Send Button */}
                                        <button type="submit" className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>

                                {/* Footer with help menu */}
                                <div className="flex justify-between w-full text-sm text-muted-foreground">
                                    <span>
                                        Powered by <b>awfatech</b> & <b>EBOSS</b>
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={toggleHelpMenu}
                                            className="px-4 py-1 border border-border rounded-md bg-muted text-foreground transition-colors duration-200 hover:bg-muted/80"
                                        >
                                            Get help
                                        </button>
                                        {isHelpMenuOpen && (
                                            <div className="absolute right-0 bottom-full mb-2 w-40 rounded-md shadow-lg bg-background ring-1 ring-border focus:outline-none z-50">
                                                <div className="py-1" role="menu" aria-orientation="vertical">
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted" role="menuitem">
                                                        <BiMessageDetail className="h-4 w-4 mr-2" />
                                                        Eboss Support
                                                    </a>
                                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted" role="menuitem">
                                                        <FaWhatsapp className="h-4 w-4 mr-2 text-green-500" />
                                                        Whatsapp
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
