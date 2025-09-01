// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { FiSend, FiCopy, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
// import { FaWhatsapp } from 'react-icons/fa';
// import { BiMessageDetail } from 'react-icons/bi';
// import { basePath } from '@/next.config';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// const animatedBorderStyle = `
// .animated-border-button {
//   position: relative;
//   overflow: hidden;
//   border-radius: 0.375rem;
//   border: 1px solid #d1d5db;
//   background-color: #f3f4f6;
//   box-shadow: 0 0 5px rgba(0, 70, 255, 0.3), 0 0 10px rgba(255, 59, 63, 0.3);
// }

// .dark .animated-border-button {
//   border-color: #4b5563;
//   background-color: #1f2937;
// }

// .animated-border-button::before {
//   content: '';
//   position: absolute;
//   top: -200%;
//   left: -200%;
//   width: 500%;
//   height: 500%;
//   background: conic-gradient(
//     from 0deg,
//     transparent 0%,
//     transparent 35%,
//     #0046FF 35%,
//     #FF3B3F 65%,
//     transparent 65%,
//     transparent 100%
//   );
//   animation: rotateConic 3s linear infinite;
//   z-index: 0;
// }

// .animated-border-button::after {
//   content: '';
//   position: absolute;
//   top: 1px;
//   right: 1px;
//   bottom: 1px;
//   left: 1px;
//   background-color: #f3f4f6;
//   border-radius: inherit;
//   z-index: 1;
// }

// .dark .animated-border-button::after {
//   background-color: #1f2937;
// }

// .animated-border-button > span {
//   position: relative;
//   z-index: 2;
//   background-color: transparent;
//   display: block;
//   padding: 0.75rem 1rem;
// }

// @keyframes rotateConic {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
// `;

// export default function ComponentsAppsAI() {
//     const suggestions = ["What's Eboss?", 'How do I sign up for Eboss?'];
//     const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
//     const [inputValue, setInputValue] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [conversation, setConversation] = useState<{ role: string; text: string }[]>([]);
//     const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
//     const [likedIndex, setLikedIndex] = useState<number | null>(null);
//     const [dislikedIndex, setDislikedIndex] = useState<number | null>(null);

//     const inputRef = useRef<HTMLTextAreaElement | null>(null);
//     const chatContainerRef = useRef<HTMLDivElement | null>(null);

//     const toggleHelpMenu = () => setIsHelpMenuOpen(!isHelpMenuOpen);

//     const handleSendMessage = async (message?: string) => {
//         const userMessage = message ?? inputValue.trim();
//         if (!userMessage) return;

//         setIsLoading(true);
//         setInputValue('');
//         setConversation((prev) => [...prev, { role: 'user', text: userMessage }]);

//         try {
//             const response = await fetch(`${basePath}/apps/api`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message: userMessage }),
//             });

//             const data = await response.json();
//             if (!response.ok) throw new Error(data.error || 'Failed to get response');

//             setConversation((prev) => [...prev, { role: 'gemini', text: data.text || data.message || 'No response from AI.' }]);
//         } catch (error: any) {
//             let errorMessage = 'Sorry, something went wrong. Please try again.';
//             if (error.message?.includes('API key')) {
//                 errorMessage = '⚠️ Invalid API key. Please check your GEMINI_API_KEY in .env.local.';
//             }
//             setConversation((prev) => [...prev, { role: 'gemini', text: errorMessage }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleCopy = (text: string, index: number) => {
//         navigator.clipboard.writeText(text);
//         setCopiedIndex(index);
//         setTimeout(() => setCopiedIndex(null), 1500);
//     };

//     const toggleLike = (index: number) => {
//         setLikedIndex(likedIndex === index ? null : index);
//         if (dislikedIndex === index) setDislikedIndex(null);
//     };

//     const toggleDislike = (index: number) => {
//         setDislikedIndex(dislikedIndex === index ? null : index);
//         if (likedIndex === index) setLikedIndex(null);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [conversation]);

//     return (
//         <>
//             <style jsx global>
//                 {animatedBorderStyle}
//             </style>

//             {/* Gradient Defs */}
//             <svg width="0" height="0">
//                 <linearGradient id="pinkRedGradient" x1="0" y1="0" x2="1" y2="1">
//                     <stop offset="0%" stopColor="#0046FF" />
//                     <stop offset="100%" stopColor="#FF3B3F" />
//                 </linearGradient>
//             </svg>

//             <div className="panel px-6 pt-6 pb-6 h-screen flex flex-col text-black dark:text-white bg-white dark:bg-black">
//                 <div className="flex-1 flex flex-col min-h-0">
//                     <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col">
//                         <div className={`flex flex-col items-center ${conversation.length === 0 ? 'justify-center flex-1' : 'py-6'}`}>
//                             <h1 className="text-2xl font-bold mb-6 text-center">What do you want to know?</h1>
//                             {conversation.length === 0 && (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 w-full max-w-xl">
//                                     <button
//                                         className="w-full text-gray-900 dark:text-gray-100 text-left transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 animated-border-button"
//                                         onClick={() => handleSendMessage(suggestions[0])}
//                                     >
//                                         <span>{suggestions[0]}</span>
//                                     </button>
//                                     <button
//                                         className="w-full px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-left py-3 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                         onClick={() => handleSendMessage(suggestions[1])}
//                                     >
//                                         {suggestions[1]}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {conversation.length > 0 && (
//                             <div className="w-full max-w-2xl mx-auto px-4 pb-4">
//                                 {conversation.map((message, index) => (
//                                     <div key={index}>
//                                         <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
//                                             <div
//                                                 className={`mb-2 inline-block px-4 py-2 rounded-lg max-w-full break-words bg-transparent text-gray-900 dark:text-gray-100 ${
//                                                     message.role === 'gemini' ? 'prose dark:prose-invert max-w-none' : ''
//                                                 }`}
//                                             >
//                                                 {message.role === 'gemini' ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown> : message.text}
//                                             </div>

//                                             {message.role === 'gemini' && (
//                                                 <div className="flex mt-2 space-x-3">
//                                                     {/* Copy */}
//                                                     <button onClick={() => handleCopy(message.text, index)} className="hover:scale-110 transition">
//                                                         <FiCopy
//                                                             size={14}
//                                                             className={copiedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
//                                                             style={copiedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
//                                                         />
//                                                     </button>

//                                                     {/* Like */}
//                                                     <button onClick={() => toggleLike(index)} className="hover:scale-110 transition">
//                                                         <FiThumbsUp
//                                                             size={14}
//                                                             className={likedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
//                                                             style={likedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
//                                                         />
//                                                     </button>

//                                                     {/* Dislike */}
//                                                     <button onClick={() => toggleDislike(index)} className="hover:scale-110 transition">
//                                                         <FiThumbsDown
//                                                             size={14}
//                                                             className={dislikedIndex === index ? 'text-transparent bg-clip-text' : 'text-black dark:text-white'}
//                                                             style={dislikedIndex === index ? { stroke: 'url(#pinkRedGradient)' } : {}}
//                                                         />
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {index < conversation.length - 1 && <hr className="my-4 border-gray-100 dark:border-gray-800" />}
//                                     </div>
//                                 ))}
//                                 {isLoading && <div className="text-center text-gray-500 dark:text-gray-400 mt-2">Thinking...</div>}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Input */}
//                 <div className="flex-shrink-0 mb-36 flex flex-col items-center pt-4 pb-4">
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             handleSendMessage();
//                         }}
//                         className="relative w-full max-w-2xl mb-4"
//                     >
//                         <textarea
//                             ref={inputRef}
//                             value={inputValue}
//                             onChange={(e) => setInputValue(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Ask anything..."
//                             className="w-full h-20 px-4 pt-3 pr-12 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
//                         />
//                         <button type="submit" className="absolute right-4 top-2 text-gray-400 dark:text-gray-500">
//                             <FiSend size={20} />
//                         </button>
//                     </form>

//                     <div className="flex justify-between w-full max-w-2xl text-sm text-gray-500 dark:text-gray-400">
//                         <span>
//                             Powered by <b>awfatech</b> & <b>EBOSS</b>
//                         </span>
//                         <div className="relative">
//                             <button
//                                 onClick={toggleHelpMenu}
//                                 className="px-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//                             >
//                                 Get help
//                             </button>
//                             {isHelpMenuOpen && (
//                                 <div className="absolute right-0 bottom-full mb-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                     <div className="py-1" role="menu" aria-orientation="vertical">
//                                         <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
//                                             <BiMessageDetail className="h-4 w-4 mr-2" />
//                                             Eboss Support
//                                         </a>
//                                         <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" role="menuitem">
//                                             <FaWhatsapp className="h-4 w-4 mr-2 text-green-500" />
//                                             Whatsapp
//                                         </a>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
