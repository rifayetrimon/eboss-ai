'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TrainingPage() {
    const [modules] = useState([
        {
            title: 'Introduction to AI',
            description: 'Basics of Artificial Intelligence and its real-world applications.',
            duration: '45 mins',
            level: 'Beginner',
        },
        {
            title: 'Deep Learning Fundamentals',
            description: 'Understand the core concepts of neural networks and training models.',
            duration: '90 mins',
            level: 'Intermediate',
        },
        {
            title: 'Prompt Engineering',
            description: 'Learn how to craft effective prompts for AI models.',
            duration: '60 mins',
            level: 'Advanced',
        },
    ]);

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-200 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            {/* Abstract gradient circles */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            {/* Main content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 flex flex-col min-h-[80vh] px-6 py-10 mt-14">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Training Program</h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">Explore interactive modules to boost your knowledge and skills.</p>
                </div>

                {/* Training Modules */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{module.title}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{module.description}</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium">{module.level}</span>
                                <span className="text-gray-500 dark:text-gray-400">{module.duration}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
