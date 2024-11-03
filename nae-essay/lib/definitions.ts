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
    id: string;
    title: string;
    author: string;
    date: string;
    essays: number;
    bookmarks: number;
    public: boolean;
}

export interface QnAType {
    id: string;
    title: string;
    author: string;
    date: string;
    comments: number;
    likes: number;
}

export interface EssayContentType {
    outline: string;
    content: string;
}

export interface EssayType {
    id: string;
    topic: string;
    author: string;
    date: string;
    content: EssayContentType[];
    public: boolean;
    comments: number;
    likes: number;
}
