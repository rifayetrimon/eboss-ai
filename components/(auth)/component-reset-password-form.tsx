'use client';
import IconMail from '@/components/icon/icon-mail';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const ComponentResetPasswordForm = () => {
    const router = useRouter();

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };
    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="Email" className="dark:text-white">
                    Email or Phone Number
                </label>
                <div className="relative text-white-dark">
                    <input id="Email" type="email" placeholder="Enter Email or Phone Number" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                <Link href="/auth/otp">RECOVER</Link>
            </button>
        </form>
    );
};

export default ComponentResetPasswordForm;
