// app/auth/app-code/page.tsx
'use client';
import AuthLayout from '@/components/layouts/AuthLayout';
import ComponentAppCodeForm from '@/components/(auth)/component-appcode';
import Alert from '@/components/ui/alert';
import { useState } from 'react';

export default function AppCodePage() {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleError = (msg: string) => {
        setErrorMessage(msg);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
    };

    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-[440px]">
                <div className="min-h-[56px] mb-5">
                    <Alert type="danger" message={errorMessage} show={showError} onClose={() => setShowError(false)} />
                </div>

                <div className="mb-7">
                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">App Code</h1>
                    <p>Enter your app code to access the system</p>
                </div>

                <ComponentAppCodeForm onErrorMessage={handleError} />
            </div>
        </AuthLayout>
    );
}
