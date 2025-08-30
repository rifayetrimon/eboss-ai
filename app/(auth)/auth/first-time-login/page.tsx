// app/auth/forgot-password/page.tsx
'use client';
import AuthLayout from '@/components/layouts/AuthLayout';
import { useRouter } from 'next/navigation';

export default function ForgetPassword() {
    const router = useRouter();
    const firstTimeLogin = (method: 'sms' | 'email') => {
        router.push(`/auth/otp?method=${method}`);
    };

    return (
        <AuthLayout>
            <div className="mb-7 text-left">
                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Password Reset</h1>
                <p>Choose how you want to receive your OTP</p>
            </div>
            <div className="space-y-5">
                <button onClick={() => firstTimeLogin('sms')} className="btn btn-gradient w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Request SMS OTP
                </button>
                <button onClick={() => firstTimeLogin('email')} className="btn btn-gradient w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Request Email OTP
                </button>
            </div>
        </AuthLayout>
    );
}
