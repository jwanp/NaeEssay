import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TopicSortType {
    id: number;
    name: 'date' | 'essays' | 'bookmarks';
    totalCount: number;
}
interface EssaySortType {
    id: number;
    name: 'date' | 'comments' | 'likes';
    totalCount: number;
    topicTitle: string;
}
interface QnASortType {
    id: number;
    name: 'date' | 'comments' | 'likes';
    totalCount: number;
}

const topicInitialState: TopicSortType = {
    id: 1,
    name: 'date',
    totalCount: 0,
};

const essayInitialState: EssaySortType = {
    id: 1,
    name: 'date',
    totalCount: 0,
    topicTitle: '',
};
const qnaInitialState: QnASortType = {
    id: 1,
    name: 'date',
    totalCount: 0,
};

export const TopicSortSlice = createSlice({
    name: 'topicSort',
    initialState: topicInitialState,
    reducers: {
        changeTopicSort(state, action: PayloadAction<{ name: 'date' | 'essays' | 'bookmarks'; id: number }>) {
            state.name = action.payload.name;
            state.id = action.payload.id;
        },
        changeTopicCount(state, action: PayloadAction<{ value: number }>) {
            state.totalCount = action.payload.value;
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
        changeEssayCount(state, action: PayloadAction<{ value: number }>) {
            state.totalCount = action.payload.value;
        },
        changeEssayTopicTitle(state, action: PayloadAction<{ value: string }>) {
            state.topicTitle = action.payload.value;
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
        changeQnaCount(state, action: PayloadAction<{ value: number }>) {
            state.totalCount = action.payload.value;
        },
    },
});

export const { changeTopicSort, changeTopicCount } = TopicSortSlice.actions;
export const { changeEssaySort, changeEssayCount, changeEssayTopicTitle } = EssaySortSlice.actions;
export const { changeQnaSort, changeQnaCount } = QnASortSlice.actions;
