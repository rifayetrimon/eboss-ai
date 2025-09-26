'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hook';
import { deleteEncryptedKey, setReminder, setEncryptedKey } from '@/store/chatSessionSlice';

type Props = {
    children: React.ReactNode;
};

const AppCodeGuard = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    // const [isAllowed, setIsAllowed] = useState<boolean | null>(null); // null = checking, true = allowed, false = not allowed
    const dispatch = useAppDispatch();

    // Safe localStorage getter
    const safeGetItem = (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    };

    useEffect(() => {
        const checkAuth = () => {
            // // Always allow auth pages
            // if (pathname.startsWith('/auth')) {
            //     setIsAllowed(true);
            //     return;
            // }

            // Check for encrypted key
            const token = safeGetItem('x-encrypted-key');
            const appCode = safeGetItem('rememberedAppCode');
            const username = safeGetItem('rememberedUsername');

            username && dispatch(setReminder({ username }));
            appCode && dispatch(setReminder({ appCode }));

            if (!token) {
                router.push('/auth/appcode');
                // setIsAllowed(false);
                dispatch(deleteEncryptedKey());
            } else {
                dispatch(setEncryptedKey(token || ''));
                // setIsAllowed(true);
            }
        };

        // Small delay to ensure client-side hydration without showing loader
        const timer = setTimeout(checkAuth, 50);

        return () => clearTimeout(timer);
    }, [router, pathname, dispatch]);

    // Don't show any loader here - let your main Loading component handle it
    // Return null while checking (this prevents rendering children too early)

    // Don't render children if not allowed
    // if (!isAllowed) {
    //     return null;
    // }

    return <>{children}</>;
};

export default AppCodeGuard;
