// components/SessionWrapper.tsx (Client Component)
'use client'; // This is important to indicate it's a client-side component

import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
