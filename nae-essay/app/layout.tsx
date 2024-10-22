import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

import StoreProvider from './StoreProvider';
import NavBar from '@/components/navbar/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nae Essay',
    description: '에세이 작성 툴, 공유 플랫폼',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>
                    <NavBar session={session}></NavBar>
                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}
