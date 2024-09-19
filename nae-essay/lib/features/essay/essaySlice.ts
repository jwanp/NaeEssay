import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
            outline: '1. outline',
            content:
                'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure fugit rerum odit quas eos fugiat in suscipit unde ipsa. Consectetur, molestiae! Molestiae minima voluptatum ipsa voluptate eaque, nemo iusto harum tenetur asperiores quam, omnis aliquid ex! Nihil pariatur inventore, magni autem ut ipsa, nostrum, quod qui iure esse illo dignissimos veniam vero! Saepe officia deleniti excepturi voluptas corporis voluptatibus optio praesentium laborum culpa provident. Odio delectus natus, perspiciatis quasi error, inventore aliquid quisquam cupiditate rem suscipit iusto illum numquam necessitatibus? Explicabo voluptates ut iure velit nobis adipisci minima repudiandae earum, quaerat dignissimos? Amet alias a voluptas ex nobis doloribus nihil.',
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
