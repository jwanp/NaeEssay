import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EditorState } from 'lexical';
interface Outline {
    outline: string;
    content: string;
}

interface Essay {
    topic: string;
    author: string;
    date: string;
    content: Outline[];
    public: boolean;
}

const initialState: Essay = {
    topic: 'Essay Topic',
    author: 'jwanp',
    date: '2024-09-16',
    content: [
        {
            outline: 'Outline',
            content: '',
        },
    ],
    public: false,
};

export const EssaySlice = createSlice({
    name: 'essay',
    initialState,
    reducers: {
        changeOutline(state, action: PayloadAction<{ value: string; idx: number }>) {
            state.content[action.payload.idx].outline = action.payload.value;
        },
        changeContent(state, action: PayloadAction<{ value: string; idx: number }>) {
            state.content[action.payload.idx].content = action.payload.value;
        },
        addOutline(state) {
            state.content.push({ outline: '', content: '' });
        },
        deleteOutline(state, action: PayloadAction<{ idx: number }>) {
            state.content.splice(action.payload.idx, 1);
        },
    },
});

export default EssaySlice.reducer;
export const { changeOutline, changeContent, addOutline, deleteOutline } = EssaySlice.actions;
