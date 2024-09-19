// redux state 를 총 관리하는 파일

import { configureStore } from '@reduxjs/toolkit';
import { NavSlice } from './features/navbar/navSlice';
import { EssaySlice } from './features/essay/essaySlice';
export const makeStore = () => {
    return configureStore({
        reducer: {
            navOpen: NavSlice.reducer,
            essay: EssaySlice.reducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
