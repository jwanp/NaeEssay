import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nae Essay',
    description: '에세이 작성 툴, 공유 플랫폼',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider store={store}>{children}</Provider>
            </body>
        </html>
    );
}
