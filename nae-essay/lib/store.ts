// redux state 를 총 관리하는 파일

import { configureStore } from '@reduxjs/toolkit';
import { NavSlice } from '../components/navbar/navSlice';
import { EssaySlice } from './features/essay/essaySlice';
import { TopicSortSlice, EssaySortSlice, QnASortSlice } from './features/sort/SortSlice';
export const makeStore = () => {
    return configureStore({
        reducer: {
            navOpen: NavSlice.reducer,
            essay: EssaySlice.reducer,
            topicSort: TopicSortSlice.reducer,
            essaySort: EssaySortSlice.reducer,
            qnaSort: QnASortSlice.reducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
