// app/auth/set-password/page.tsx
'use client';
import AuthLayout from '@/components/layouts/AuthLayout';
import ComponentSetPassword from '@/components/(auth)/component-set-password';

export default function SetPasswordPage() {
    return (
        <AuthLayout showBackButton>
            <div className="mx-auto w-full max-w-[440px]">
                <div className="mb-7 text-left">
                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Set Password</h1>
                    <p>Enter and confirm your new password below.</p>
                </div>
                <ComponentSetPassword />
            </div>
        </AuthLayout>
    );
}
