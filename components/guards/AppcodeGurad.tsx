'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
    children: React.ReactNode;
};

const AppCodeGuard = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null); // null = checking, true = allowed, false = not allowed

    // Safe localStorage getter
    const safeGetItem = (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    };

    useEffect(() => {
        const checkAuth = () => {
            // Always allow auth pages
            if (pathname.startsWith('/auth')) {
                setIsAllowed(true);
                return;
            }

            // Check for encrypted key
            const token = safeGetItem('x-encrypted-key');

            if (!token) {
                router.replace('/auth/appcode');
                setIsAllowed(false);
            } else {
                setIsAllowed(true);
            }
        };

        // Small delay to ensure client-side hydration without showing loader
        const timer = setTimeout(checkAuth, 50);

        return () => clearTimeout(timer);
    }, [router, pathname]);

    // Don't show any loader here - let your main Loading component handle it
    // Return null while checking (this prevents rendering children too early)
    if (isAllowed === null) {
        return null; // Your main <Loading /> will show instead
    }

    // Don't render children if not allowed
    if (!isAllowed) {
        return null;
    }

    return <>{children}</>;
};

export default AppCodeGuard;
