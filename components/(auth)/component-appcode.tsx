'use client';

import { FaKey } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAppCode } from '@/hook/auth/useAppCode';
import { useAppDispatch } from '@/store/hook';
import { setReminder } from '@/store/chatSessionSlice';

type Props = {
    onErrorMessage: (message: string) => void;
};

const ComponentAppCodeForm = ({ onErrorMessage }: Props) => {
    const [rememberAppCode, setRememberAppCode] = useState(false);
    const [appCodeInput, setAppCodeInput] = useState('');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { mutate: validateAppCode, isPending } = useAppCode();

    // ✅ Load saved app code after hydration
    useEffect(() => {
        const savedAppCode = localStorage.getItem('rememberedAppCode');
        if (savedAppCode) {
            dispatch(
                setReminder({
                    appCode: savedAppCode,
                }),
            );
            setAppCodeInput(savedAppCode);
            setRememberAppCode(true);
        }
    }, [dispatch]);

    const submitAppCode = (e: React.FormEvent) => {
        e.preventDefault();
        onErrorMessage(''); // clear previous errors

        if (!appCodeInput.trim()) {
            onErrorMessage('Please enter an app code');
            return;
        }

        // ✅ Save/remove remembered app code
        if (rememberAppCode) {
            localStorage.setItem('rememberedAppCode', appCodeInput);
        } else {
            localStorage.removeItem('rememberedAppCode');
        }

        validateAppCode(appCodeInput, {
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
    // if (!isReady) return null;

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
                        value={appCodeInput}
                        onChange={(e) => setAppCodeInput(e.target.value)}
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
