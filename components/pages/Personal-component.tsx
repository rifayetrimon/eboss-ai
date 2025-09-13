'use client';

import { motion } from 'framer-motion';
import { usePersonalityContext } from '@/context/PersonalityContext';
import Image from 'next/image';

export default function PersonalContent() {
    const { currentExpertiseData: data } = usePersonalityContext();

    if (!data) return <div className="p-10">Loading...</div>;

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
            {/* Abstract gradient circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 flex flex-col min-h-[80vh] px-6 py-10 mt-14">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <Image src={data.image} alt={data.name} width={240} height={240} className="md:w-60 md:h-60 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
                    </div>

                    {/* Right Side Content */}
                    <div className="flex flex-col flex-1">
                        <div className="mb-4">
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{data.name}</h1>
                            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">{data.current_expertise.toUpperCase()}</p>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-6">{data.description}</p>

                        <div className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Specialization</h2>
                            <p className="text-gray-600 dark:text-gray-300">{data.specialization}</p>
                        </div>

                        <div className="mb-6 w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personality Traits</h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-left">
                                {(data.personality_traits as string[]).map((trait, idx) => (
                                    <li key={idx}>{trait}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="px-4 py-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-medium">Temperature: {data.temperature}</div>
                            <div className="px-4 py-2 rounded-lg bg-green-50/80 dark:bg-green-900/80 text-green-700 dark:text-green-300 font-medium">Max Tokens: {data.max_tokens}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
