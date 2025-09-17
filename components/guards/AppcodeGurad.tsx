'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
    children: React.ReactNode;
};

const AppCodeGuard = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        if (pathname.startsWith('/auth')) {
            setIsAllowed(true);
            return;
        }
        const token = localStorage.getItem('x-encrypted-key');
        if (!token) {
            router.replace('/auth/appcode'); // redirect if no token
        } else {
            setIsAllowed(true); // allow rendering
        }
    }, [router]);

    if (!isAllowed) return null;

    return <>{children}</>;
};

export default AppCodeGuard;
