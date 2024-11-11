import { EditorState } from 'lexical';

// 공유하는 타입들 지정해 두는 파일
export interface Outline {
    outline: string;
    content: string;
}

export interface OnChangePluginProps {
    idx: number;
    onChange: (editorState: EditorState, idx: number) => void;
}

export interface TopicType {
    _id: string;
    title: string;
    author: string;
    date: string;
    bookmarks: unknown;
    essays: unknown;
    is_public: boolean;
    bookmarkCount: number;
    essayCount: number;
}

export interface QnAType {
    id: string;
    title: string;
    author: string;
    date: string;
    comments: unknown;
    likes: unknown;
    commentCount: number;
    likeCount: number;
}

export interface EssayContentType {
    outline: string;
    content: string;
    text?: string;
}

export interface EssayType {
    id: string;
    topic: string;
    topicId: string;
    author: string;
    date: string;
    content: EssayContentType[];
    public: boolean;
    comments: unknown;
    likes: unknown;
    commentCount: number;
    likeCount: number;
}
