import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EditorState } from 'lexical';
import { EssayType, EssayContentType } from '@/lib/definitions';
interface Outline {
    outline: string;
    content: string;
}

interface Essay {
    topic: string;
    topicId: string;
    content: Outline[];
    public: boolean;
}

const initialState: Essay = {
    topic: '',
    topicId: '',
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
        chageTopic(state, action: PayloadAction<{ value: string; id: string }>) {
            state.topic = action.payload.value;
            state.topicId = action.payload.id;
        },
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
export const { chageTopic, changeOutline, changeContent, addOutline, deleteOutline } = EssaySlice.actions;
