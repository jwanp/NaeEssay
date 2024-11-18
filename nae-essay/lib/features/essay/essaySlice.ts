import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Outline {
    outline: string;
    content?: string;
    text?: string;
    htmlString?: string;
}

export interface Like {
    _id: string;
    email: string;
    essayId: string;
    date: string;
}

export interface Comment {
    _id: string;
    username: string;
    email: string;
    content: string;
    date: string;
    edited: boolean;
}
export interface Essay {
    _id: string | null;
    topic: string;
    topicId: string;
    content: Outline[];
    public: boolean;
    email: string;
    author: string;
    date: string;
    like: Like[];
    comment: Comment[];
    likeCount: number;
    commentCount: number;
    myLikeIds: string[] | null;
    myCommentCount: number | null;
}

const initialState: Essay = {
    _id: null,
    topic: '',
    topicId: '',
    content: [
        {
            outline: 'Outline',
            content: '',
            text: '',
        },
    ],
    public: true,
    email: '',
    author: '',
    date: '',
    like: [],
    comment: [],
    likeCount: 0,
    commentCount: 0,
    myLikeIds: null,
    myCommentCount: null,
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
        changeContent(state, action: PayloadAction<{ value: string; idx: number; text: string }>) {
            const { value, idx, text = null } = action.payload;
            state.content[action.payload.idx].content = action.payload.value;
            if (text != null) {
                state.content[action.payload.idx].text = action.payload.text;
            }
        },
        saveHtmlContent(state, action: PayloadAction<{ htmlString: string; idx: number }>) {
            state.content[action.payload.idx].htmlString = action.payload.htmlString;
        },
        addOutline(state) {
            state.content.push({ outline: '', content: '', text: '' });
        },
        deleteOutline(state, action: PayloadAction<{ idx: number }>) {
            state.content.splice(action.payload.idx, 1);
        },
        changeEssayId(state, action: PayloadAction<{ essayId: string }>) {
            state._id = action.payload.essayId;
        },
        clearEssay(state) {
            return initialState;
        },
        changeEssay(state, action: PayloadAction<{ essay: Essay }>) {
            return action.payload.essay;
        },
        clearHtml(state) {
            // Iterate over each content item and clear the htmlString property
            state.content.forEach((outline) => {
                outline.htmlString = undefined; // Or use null, depending on your needs
            });
        },

        increaseLikeCount(state) {
            if (state.likeCount == undefined) return undefined;
            state.likeCount = state.likeCount + 1;
        },
        decreaseLikeCount(state) {
            if (state.likeCount == undefined) return undefined;
            state.likeCount = state.likeCount - 1;
        },
        setEssayComments(state, action: PayloadAction<{ value: Comment[] }>) {
            state.comment = action.payload.value;
        },
        changeEssayComment(state, action: PayloadAction<{ idx: number; value: Comment }>) {
            state.comment[action.payload.idx] = action.payload.value;
        },
        clearEssayComments(state) {
            return initialState;
        },
        deleteEssayComment(state, action: PayloadAction<{ idx: number }>) {
            const commentCopy: Comment[] = [...state.comment];
            commentCopy.splice(action.payload.idx, 1);
            state.comment = commentCopy;
        },
        pushEssayComment(state, action: PayloadAction<{ value: Comment }>) {
            state.comment.push(action.payload.value);
        },
    },
});

export default EssaySlice.reducer;
export const {
    chageTopic,
    changeOutline,
    changeContent,
    addOutline,
    deleteOutline,
    changeEssayId,
    saveHtmlContent,
    clearEssay,
    changeEssay,
    increaseLikeCount,
    decreaseLikeCount,
    setEssayComments,
    changeEssayComment,
    clearEssayComments,
    deleteEssayComment,
    pushEssayComment,
    clearHtml,
} = EssaySlice.actions;
