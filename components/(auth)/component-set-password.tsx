'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconEye from '@/components/icon/icon-eye';

const ComponentSetPasswordForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Simulate password set (you can integrate API here)
        router.push('/auth/login?status=success');
    };

    return (
        <form className="space-y-5" onSubmit={submitForm}>
            <div>
                <label htmlFor="Password" className="dark:text-white">New Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input ps-10 pe-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-4 top-1/2 -translate-y-1/2"
                        tabIndex={-1}
                    >
                        <IconEye />
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="ConfirmPassword" className="dark:text-white">Confirm Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="ConfirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-type Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input ps-10 pe-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute end-4 top-1/2 -translate-y-1/2"
                        tabIndex={-1}
                    >
                        <IconEye />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-gradient !mt-12 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                SET PASSWORD
            </button>
        </form>
    );
};

export default ComponentSetPasswordForm;
