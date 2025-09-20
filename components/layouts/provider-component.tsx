'use client';

import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense, useState, useEffect } from 'react';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';
import Loading from '@/components/layouts/loading';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use your existing Loading component instead of custom loader
    if (!isMounted) {
        return <Loading />; // Your existing loader component
    }

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<Loading />}>
                    {' '}
                    {/* Your existing loader */}
                    <App>{children}</App>
                </Suspense>
            </QueryClientProvider>
        </Provider>
    );
};

export default ProviderComponent;
