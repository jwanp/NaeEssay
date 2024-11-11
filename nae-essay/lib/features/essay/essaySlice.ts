import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EditorState } from 'lexical';
import { EssayType, EssayContentType } from '@/lib/definitions';
interface Outline {
    outline: string;
    content: string;
    text?: string;
}

export interface Essay {
    essayId: string | null;
    topic: string;
    topicId: string;
    content: Outline[];
    public: boolean;
}

const initialState: Essay = {
    essayId: null,
    topic: '',
    topicId: '',
    content: [
        {
            outline: 'Outline',
            content: '',
        },
    ],
    public: true,
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
        changeContent(state, action: PayloadAction<{ value: string; idx: number; text?: string }>) {
            const { value, idx, text = null } = action.payload;
            state.content[action.payload.idx].content = action.payload.value;
            if (text != null) {
                state.content[action.payload.idx].text = action.payload.text;
            }
        },
        addOutline(state) {
            state.content.push({ outline: '', content: '' });
        },
        deleteOutline(state, action: PayloadAction<{ idx: number }>) {
            state.content.splice(action.payload.idx, 1);
        },
        changeEssayId(state, action: PayloadAction<{ essayId: string }>) {
            state.essayId = action.payload.essayId;
        },
    },
});

export default EssaySlice.reducer;
export const { chageTopic, changeOutline, changeContent, addOutline, deleteOutline, changeEssayId } =
    EssaySlice.actions;
