'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconEye from '@/components/icon/icon-eye';
import { useLogin } from '@/hook/auth/useLogin';

const ComponentLogin = ({ setErrorMessage }: { setErrorMessage: (msg: string) => void }) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { mutate: login, isPending } = useLogin();

    // Load saved username on mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        // Save username if Remember Me checked
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        login(
            { username, password },
            {
                onSuccess: () => router.push('/'),
                onError: (err: any) => setErrorMessage(err?.message || 'Login failed'),
            },
        );
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
                <label htmlFor="Username">Username</label>
                <div className="relative text-white-dark">
                    <input
                        id="Username"
                        name="username"
                        type="text"
                        placeholder="Enter username / mobile number"
                        className="form-input ps-10 placeholder:text-white-dark"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username" // Allow browser autofill
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">
                        <FaUser />
                    </span>
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Password"
                        className="form-input ps-10 pe-10 placeholder:text-white-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="password" // Allow browser autofill
                        required
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    <button
                        type="button"
                        onMouseDown={() => setShowPassword(true)}
                        onMouseUp={() => setShowPassword(false)}
                        onMouseLeave={() => setShowPassword(false)}
                        onTouchStart={() => setShowPassword(true)}
                        onTouchEnd={() => setShowPassword(false)}
                        className="absolute end-4 top-1/2 -translate-y-1/2"
                        tabIndex={-1}
                    >
                        <IconEye />
                    </button>
                </div>
            </div>

            {/* Remember Me */}
            <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <span className="text-white-dark ml-2">Remember me</span>
                </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default ComponentLogin;
