import { EditorState } from 'lexical';
import { ObjectId } from 'mongodb';
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
    email?: string;
    date: string;
    bookmark: { _id: string; topicId: string; email: string; date: string }[];
    essay: unknown[];
    is_public: boolean;
    bookmarkCount: number;
    essayCount: number;
}

export interface QnAType {
    id: string;
    title: string;
    author: string;
    email?: string;
    date: string;
    comments: unknown;
    likes: unknown;
    commentCount: number;
    likeCount: number;
}

export interface EssayContentType {
    outline: string;
    text: string;
    htmlString: string;
}

export interface EssayType {
    _id: string;
    topic: string;
    topicId: string;
    author: string;
    email?: string;
    date: string;
    content: EssayContentType[];
    public: boolean;
    comments?: unknown;
    likes?: unknown;
    commentCount?: number;
    likeCount?: number;
}

export interface EssayLike {
    _id?: ObjectId;
    essayId: ObjectId;
    userId: ObjectId;
    likedAt: Date;
}

export interface EssayComment {
    _id?: ObjectId;
    essayId: ObjectId;
    author: string;
    content: string;
    date: Date;
}
