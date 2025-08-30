'use client';

import { FaKey } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAppCode } from '@/hook/auth/useAppCode';

type Props = {
    onErrorMessage: (message: string) => void;
};

const ComponentAppCodeForm = ({ onErrorMessage }: Props) => {
    const [appCode, setAppCode] = useState('');
    const router = useRouter();

    const { mutate: validateAppCode, isPending } = useAppCode();

    const submitAppCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appCode.trim()) return;

        validateAppCode(appCode, {
            onSuccess: () => {
                router.push('/auth/login');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.detail || 'Invalid app code';
                onErrorMessage(message);
            },
        });
    };

    return (
        <form className="space-y-5" onSubmit={submitAppCode}>
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
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <FaKey className="text-lg text-white-dark" />
                    </span>
                </div>
            </div>

            <button type="submit" disabled={isPending} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                {isPending ? 'PROCESSING...' : 'PROCESS'}
            </button>
        </form>
    );
};

export default ComponentAppCodeForm;
