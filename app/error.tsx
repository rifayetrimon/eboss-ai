'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <h1 className="mb-4 text-3xl font-bold text-red-600">Something went wrong!</h1>
            <p className="mb-8 text-gray-700 dark:text-gray-300">An unexpected error has occurred. Please try again later.</p>
            <button onClick={() => window.location.reload()} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Reload Page
            </button>
        </div>
    );
}
