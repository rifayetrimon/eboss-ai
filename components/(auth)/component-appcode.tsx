// components/(auth)/component-appcode.tsx
'use client';

import { FaKey } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAppCode } from '@/hook/auth/useAppCode';

type Props = {
    onErrorMessage: (message: string) => void;
};

const ComponentAppCodeForm = ({ onErrorMessage }: Props) => {
    const [appCode, setAppCode] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [rememberAppCode, setRememberAppCode] = useState(false);
    const router = useRouter();

    const { mutate: validateAppCode, isPending } = useAppCode();

    // ✅ Load saved app code after hydration
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            const savedAppCode = localStorage.getItem('rememberedAppCode');
            if (savedAppCode) {
                setAppCode(savedAppCode);
                setRememberAppCode(true);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    const submitAppCode = (e: React.FormEvent) => {
        e.preventDefault();
        onErrorMessage(''); // clear previous errors

        if (!appCode.trim()) {
            onErrorMessage('Please enter an app code');
            return;
        }

        // ✅ Save/remove remembered app code
        if (rememberAppCode) {
            localStorage.setItem('rememberedAppCode', appCode);
        } else {
            localStorage.removeItem('rememberedAppCode');
        }

        validateAppCode(appCode, {
            onSuccess: () => {
                router.push('/auth/login');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'Invalid app code';
                onErrorMessage(message);
            },
        });
    };

    // ✅ Prevent hydration mismatch
    if (!isReady) return null;

    return (
        <form className="space-y-5" onSubmit={submitAppCode}>
            {/* App Code Field */}
            <div>
                <label htmlFor="AppCode" className="dark:text-white">
                    App Code
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="AppCode"
                        type="text"
                        placeholder="Enter App Code"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={appCode}
                        onChange={(e) => setAppCode(e.target.value)}
                        disabled={isPending}
                        autoComplete="off"
                        spellCheck={false}
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FaKey className="text-lg text-white-dark" />
                    </span>
                </div>
            </div>

            {/* Remember Me */}
            <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" checked={rememberAppCode} onChange={(e) => setRememberAppCode(e.target.checked)} />
                    <span className="ml-2 text-white-dark">Remember app code</span>
                </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isPending} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                {isPending ? 'PROCESSING...' : 'PROCESS'}
            </button>
        </form>
    );
};

export default ComponentAppCodeForm;
