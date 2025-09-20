// components/guards/LoginGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
    children: React.ReactNode;
};

const LoginGuard = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            // ✅ Dev override (skip login during dev)
            if (process.env.NEXT_PUBLIC_SKIP_LOGIN === 'true') {
                setIsAllowed(true);
                return;
            }

            // ✅ Always allow appcode page
            if (pathname.startsWith('/auth/appcode')) {
                setIsAllowed(true);
                return;
            }

            // ✅ Step 1: Require appcode before login
            const appCode = localStorage.getItem('x-encrypted-key');
            if (!appCode) {
                router.replace('/auth/appcode');
                setIsAllowed(false);
                return;
            }

            // ✅ Step 2: Require user login token
            const token = localStorage.getItem('userToken');
            if (!token) {
                router.replace('/auth/login');
                setIsAllowed(false);
                return;
            }

            // ✅ Both checks passed
            setIsAllowed(true);
        };

        const timer = setTimeout(checkAuth, 50); // small delay for hydration
        return () => clearTimeout(timer);
    }, [router, pathname]);

    if (isAllowed === null) return null; // wait until check finishes
    if (!isAllowed) return null; // blocked → redirect happens

    return <>{children}</>;
};

export default LoginGuard;

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// type Props = {
//     children: React.ReactNode;
// };

// const LoginGuard = ({ children }: Props) => {
//     const router = useRouter();
//     const [isAllowed, setIsAllowed] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem('userToken');
//         if (!token) {
//             router.replace('/auth/login'); // redirect to login if not authenticated
//         } else {
//             setIsAllowed(true); // allow rendering if logged in
//         }
//     }, [router]);

//     if (!isAllowed) return null;

//     return <>{children}</>;
// };

// export default LoginGuard;
