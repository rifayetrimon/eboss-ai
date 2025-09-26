'use client';

import ComponentAppCodeForm from '@/components/(auth)/component-appcode';
import AuthLayout from '@/components/layouts/AuthLayout';
import Alert from '@/components/ui/alert';
import { useAppSelector } from '@/store/hook';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// Dynamic import to prevent SSR issues
// const ComponentAppCodeForm = dynamic(() => import('@/components/(auth)/component-appcode'), {
//     ssr: false, // This prevents SSR for this component
//     loading: () => <Loading />, // Use your existing loader
// });

export default function AppCodePageAlternative() {
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const encryptedKey = useAppSelector((state) => state?.chatSession?.encryptedKey);

    useEffect(() => {
        if (encryptedKey) {
            router.push('/'); // Redirect to home if encryptedKey exists
        }
    }, [encryptedKey, router]);

    const handleError = (msg: string) => {
        setErrorMessage(msg);
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
            setErrorMessage('');
        }, 6000);
    };

    const handleErrorClose = () => {
        setShowError(false);
        setErrorMessage('');
    };

    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-[440px]">
                <div className="min-h-[56px] mb-5">{showError && <Alert type="danger" message={errorMessage} show={showError} onClose={handleErrorClose} />}</div>

                <div className="mb-7">
                    <h1 className="text-left text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">App Code</h1>
                    <p className="text-left text-base font-bold leading-normal text-white-dark">Enter your app code to access the system</p>
                </div>

                {/* This will show your Loading component while the form loads */}
                <ComponentAppCodeForm onErrorMessage={handleError} />
            </div>
        </AuthLayout>
    );
}
