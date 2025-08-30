// app/auth/otp/page.tsx
'use client';

import AuthLayout from '@/components/layouts/AuthLayout';
import ComponentOTPForm from '@/components/(auth)/component-otp-form';

export default function OtpPage() {
    return (
        <AuthLayout>
            <div className="mx-auto w-full max-w-[440px]">
                <div className="mb-7">
                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Enter OTP</h1>
                    <p>We sent a code to your email. Please enter it below to verify.</p>
                </div>
                <ComponentOTPForm />
            </div>
        </AuthLayout>
    );
}
