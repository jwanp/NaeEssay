import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StoreProvider from './StoreProvider';

import NavBar from '@/lib/features/navbar/NavBar';

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
                <StoreProvider>
                    <NavBar></NavBar>
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
