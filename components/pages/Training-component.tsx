// components/content/training-content.tsx

'use client';

import { motion } from 'framer-motion';

export default function TrainingContent() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">Training & History</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">View your training history and manage data here.</p>
        </motion.div>
    );
}
