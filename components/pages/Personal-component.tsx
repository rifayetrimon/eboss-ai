'use client';

import { motion } from 'framer-motion';
import { usePersonalityContext } from '@/context/PersonalityContext';
import { useEffect } from 'react';
import Image from 'next/image';
import Loading from '../layouts/loading';

export default function PersonalContent() {
    const { currentExpertiseData: data, refreshExpertise } = usePersonalityContext() || {};

    // ✅ Auto-refresh when component mounts to ensure we have the latest data
    useEffect(() => {
        const initializePersonalityData = async () => {
            try {
                refreshExpertise && await refreshExpertise();
                console.log('✅ PersonalContent: Personality data refreshed on mount');
            } catch (error) {
                console.error('❌ PersonalContent: Error refreshing personality data:', error);
            }
        };

        initializePersonalityData();
    }, [refreshExpertise]);

    // ✅ Debug logging for data changes
    useEffect(() => {
        if (data) {
            console.log('🎯 PersonalContent: Current expertise updated to:', data.current_expertise);
        }
    }, [data?.current_expertise]);

    if (!data) {
        return (
            <div className="p-10 flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <Loading />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading personality data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            {/* Abstract gradient circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <motion.div
                key={data.current_expertise} // ✅ Re-animate when expertise changes
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col min-h-[80vh] px-6 py-10 mt-14"
            >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <motion.div key={data.image} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                            <Image src={data.image} alt={data.name} width={240} height={240} className="md:w-60 md:h-60 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
                        </motion.div>
                    </div>

                    {/* Right Side Content */}
                    <div className="flex flex-col flex-1">
                        <div className="mb-4">
                            <motion.h1
                                key={data.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-4xl font-bold text-gray-800 dark:text-white"
                            >
                                {data.name}
                            </motion.h1>

                            {/* ✅ This is the synced expertise display */}
                            <motion.p
                                key={data.current_expertise}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="text-lg text-indigo-600 dark:text-indigo-400 font-medium dark:bg-indigo-900/30 inline-block mt-2"
                            >
                                {data.current_expertise.toUpperCase()}
                            </motion.p>
                        </div>

                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="text-gray-700 dark:text-gray-300 mb-6">
                            {data.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Specialization</h2>
                            <p className="text-gray-600 dark:text-gray-300">{data.specialization}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personality Traits</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-left">
                                {(data.personality_traits as string[]).map((trait, idx) => (
                                    <motion.li key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}>
                                        {trait}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} className="flex flex-wrap gap-4">
                            <div className="px-4 py-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-medium">Temperature: {data.temperature}</div>
                            <div className="px-4 py-2 rounded-lg bg-green-50/80 dark:bg-green-900/80 text-green-700 dark:text-green-300 font-medium">Max Tokens: {data.max_tokens}</div>
                        </motion.div>
                    </div>
                </div>

                {/* ✅ Debug info for development */}
                {process.env.NODE_ENV === 'development' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded max-w-64">
                        <p>
                            Current Expertise: <strong>{data.current_expertise}</strong>
                        </p>
                        <p>Last Updated: {new Date().toLocaleTimeString()}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

// 'use client';

// import { motion } from 'framer-motion';
// import { usePersonalityContext } from '@/context/PersonalityContext';
// import { useEffect } from 'react';
// import Image from 'next/image';
// import Loading from '../layouts/loading';

// export default function PersonalContent() {
//     const { currentExpertiseData: data, refreshExpertise } = usePersonalityContext();

//     // ✅ Auto-refresh when component mounts to ensure we have the latest data
//     useEffect(() => {
//         const initializePersonalityData = async () => {
//             try {
//                 await refreshExpertise();
//                 console.log('✅ PersonalContent: Personality data refreshed on mount');
//             } catch (error) {
//                 console.error('❌ PersonalContent: Error refreshing personality data:', error);
//             }
//         };

//         initializePersonalityData();
//     }, [refreshExpertise]);

//     // ✅ Debug logging for data changes
//     useEffect(() => {
//         if (data) {
//             console.log('🎯 PersonalContent: Current expertise updated to:', data.current_expertise);
//         }
//     }, [data?.current_expertise]);

//     if (!data) {
//         return (
//             <div className="p-10 flex items-center justify-center min-h-[50vh]">
//                 <div className="text-center">
//                     <Loading />
//                     <p className="mt-4 text-gray-600 dark:text-gray-400">Loading personality data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
//             {/* Abstract gradient circles */}
//             <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//             <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//             <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

//             <motion.div
//                 key={data.current_expertise} // ✅ Re-animate when expertise changes
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="relative z-10 flex flex-col min-h-[80vh] px-6 py-10 mt-14"
//             >
//                 <div className="flex flex-col md:flex-row gap-10 items-start">
//                     {/* Profile Image */}
//                     <div className="flex-shrink-0">
//                         <motion.div key={data.image} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
//                             <Image src={data.image} alt={data.name} width={240} height={240} className="md:w-60 md:h-60 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
//                         </motion.div>
//                     </div>

//                     {/* Right Side Content */}
//                     <div className="flex flex-col flex-1">
//                         <div className="mb-4">
//                             <motion.h1
//                                 key={data.name}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.4 }}
//                                 className="text-4xl font-bold text-gray-800 dark:text-white"
//                             >
//                                 {data.name}
//                             </motion.h1>

//                             {/* ✅ This is the synced expertise display */}
//                             <motion.p
//                                 key={data.current_expertise}
//                                 initial={{ opacity: 0, scale: 0.9 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="text-lg text-indigo-600 dark:text-indigo-400 font-medium dark:bg-indigo-900/30 inline-block mt-2"
//                             >
//                                 {data.current_expertise.toUpperCase()}
//                             </motion.p>
//                         </div>

//                         <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-gray-700 dark:text-gray-300 mb-6">
//                             {data.description}
//                         </motion.p>

//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4 }}
//                             className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
//                         >
//                             <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Specialization</h2>
//                             <p className="text-gray-600 dark:text-gray-300">{data.specialization}</p>
//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4 }}
//                             className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
//                         >
//                             <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personality Traits</h2>
//                             <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-left">
//                                 {(data.personality_traits as string[]).map((trait, idx) => (
//                                     <motion.li key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
//                                         {trait}
//                                     </motion.li>
//                                 ))}
//                             </ul>
//                         </motion.div>

//                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap gap-4">
//                             <div className="px-4 py-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-medium">Temperature: {data.temperature}</div>
//                             <div className="px-4 py-2 rounded-lg bg-green-50/80 dark:bg-green-900/80 text-green-700 dark:text-green-300 font-medium">Max Tokens: {data.max_tokens}</div>
//                         </motion.div>
//                     </div>
//                 </div>

//                 {/* ✅ Debug info for development */}
//                 {process.env.NODE_ENV === 'development' && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded max-w-64">
//                         <p>
//                             Current Expertise: <strong>{data.current_expertise}</strong>
//                         </p>
//                         <p>Last Updated: {new Date().toLocaleTimeString()}</p>
//                     </motion.div>
//                 )}
//             </motion.div>
//         </div>
//     );
// }
