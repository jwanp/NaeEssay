import { Cache } from '@emotion/react';
import 'next/app';

declare module 'next/app' {
    interface AppProps {
        emotionCache?: Cache;
    }
}
