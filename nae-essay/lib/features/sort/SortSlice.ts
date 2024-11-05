import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TopicSortType {
    id: number;
    name: 'date' | 'essays' | 'bookmarks';
}
interface EssaySortType {
    id: number;
    name: 'date' | 'comments' | 'likes';
}
interface QnASortType {
    id: number;
    name: 'date' | 'comments' | 'likes';
}

const topicInitialState: TopicSortType = {
    id: 1,
    name: 'date',
};

const essayInitialState: EssaySortType = {
    id: 1,
    name: 'date',
};
const qnaInitialState: QnASortType = {
    id: 1,
    name: 'date',
};

export const TopicSortSlice = createSlice({
    name: 'topicSort',
    initialState: topicInitialState,
    reducers: {
        changeTopicSort(state, action: PayloadAction<{ name: 'date' | 'essays' | 'bookmarks'; id: number }>) {
            state.name = action.payload.name;
            state.id = action.payload.id;
        },
    },
});

export const EssaySortSlice = createSlice({
    name: 'essaySort',
    initialState: essayInitialState,
    reducers: {
        changeEssaySort(state, action: PayloadAction<{ name: 'date' | 'comments' | 'likes'; id: number }>) {
            state.name = action.payload.name;
            state.id = action.payload.id;
        },
    },
});
export const QnASortSlice = createSlice({
    name: 'qnaSort',
    initialState: qnaInitialState,
    reducers: {
        changeQnaSort(state, action: PayloadAction<{ name: 'date' | 'comments' | 'likes'; id: number }>) {
            state.name = action.payload.name;
            state.id = action.payload.id;
        },
    },
});

export const { changeTopicSort } = TopicSortSlice.actions;
export const { changeEssaySort } = EssaySortSlice.actions;
export const { changeQnaSort } = QnASortSlice.actions;
