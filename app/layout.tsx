import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { PersonalityProvider } from '@/context/PersonalityContext';
import AppCodeGuard from '@/components/guards/AppcodeGurad';

export const metadata: Metadata = {
    title: {
        template: '%s | Eboss AI',
        default: 'Eboss AI',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <ProviderComponent>
                    <PersonalityProvider>
                        {children}</PersonalityProvider>
                </ProviderComponent>
            </body>
        </html>
    );
}
