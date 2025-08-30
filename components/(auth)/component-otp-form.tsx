'use client';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import Link from 'next/link';

const ComponentOTPForm = () => {
    const router = useRouter();

    // Fix: Initialize the array with 5 nulls
    const inputsRef = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();

        // Collect OTP values (optional)
        const otp = inputsRef.current.map((input) => input?.value).join('');
        console.log('Entered OTP:', otp);

        router.push('/');
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (/^[0-9]$/.test(value)) {
            inputsRef.current[index]!.value = value;

            // Move to next field
            if (index < inputsRef.current.length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        } else if (value === '') {
            // Backspace handling
            inputsRef.current[index]!.value = '';
            if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        } else {
            // Prevent non-numeric input
            e.target.value = '';
        }
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label className="block dark:text-white mb-2">Enter OTP</label>
                <div className="flex justify-between gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <input
                            key={i}
                            // ref={(el) => (inputsRef.current[i] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="form-input w-12 h-12 text-center text-xl placeholder:text-white-dark"
                            onChange={(e) => handleChange(i, e)}
                        />
                    ))}
                </div>
            </div>
            <Link href="/auth/set-password">
                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    VERIFY
                </button>
            </Link>
        </form>
    );
};

export default ComponentOTPForm;
