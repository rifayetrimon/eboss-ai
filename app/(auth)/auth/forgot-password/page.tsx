// app/auth/forgot-password/page.tsx
'use client';

import AuthLayout from '@/components/layouts/AuthLayout';
import ComponentResetPasswordForm from '@/components/(auth)/component-reset-password-form';

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-[440px]">
                <div className="mb-7">
                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Password Reset</h1>
                    <p>Enter your email to recover your ID</p>
                </div>
                <ComponentResetPasswordForm />
            </div>
        </AuthLayout>
    );
}
