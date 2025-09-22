'use client';

import App from '@/App';
import Loading from '@/components/layouts/loading';
import store from '@/store';
import { ReactNode, Suspense } from 'react';
import { Provider } from 'react-redux';

import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
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
