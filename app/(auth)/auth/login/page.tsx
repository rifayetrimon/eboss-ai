// app/auth/login/page.tsx
'use client';

import AuthLayout from '@/components/layouts/AuthLayout';
import ComponentLogin from '@/components/(auth)/component-login';
import Alert from '@/components/ui/alert';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'success') {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    return (
        <AuthLayout backToAppCode>
            <div className="mx-auto w-full max-w-[440px]">
                {/* Alerts */}
                <div className="min-h-[56px] mb-5 space-y-2">
                    <Alert type="success" message="Password has been set successfully." show={showSuccess} onClose={() => setShowSuccess(false)} />
                    <Alert type="danger" message={errorMessage} show={!!errorMessage} onClose={() => setErrorMessage('')} />
                </div>

                {/* Title */}
                <div className="mb-10">
                    <h1 className="text-left text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                    <p className="text-left text-base font-bold leading-normal text-white-dark">Enter your username and password to login</p>
                </div>

                {/* Form */}
                <ComponentLogin setErrorMessage={setErrorMessage} />

                {/* Links */}
                <div className="relative my-7 text-center md:mb-9">
                    <Link href="/auth/forgot-password" className="text-sm text-primary transition hover:text-black dark:hover:text-white">
                        Forgot Password?
                    </Link>
                </div>

                <div className="relative my-7 text-center md:mb-9">
                    <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#d1d5db] dark:bg-[#4b5563]"></span>
                    <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                </div>

                <div className="text-center dark:text-white">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/boxed-signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                        SIGN UP
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
