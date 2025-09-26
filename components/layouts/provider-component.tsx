'use client';

import App from '@/App';
import store from '@/store';
import { ReactNode } from 'react';
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
                {/* Your existing loader */}
                <App>{children}</App>
            </QueryClientProvider>
        </Provider>
    );
};

export default ProviderComponent;
