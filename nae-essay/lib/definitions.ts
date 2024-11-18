import { EditorState } from 'lexical';
import { ObjectId } from 'mongodb';
// 공유하는 타입들 지정해 두는 파일

export interface OnChangePluginProps {
    idx: number;
    onChange: (editorState: EditorState, idx: number) => void;
}

export interface TopicType {
    _id: string;
    title: string;
    author: string;
    email?: string;
    bookmarkCount: number;
    date: string;
    myEssayCount: number | null;
    essayCount: number;
    is_public: boolean;
    myBookmarkIds: null | string[];
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

import { Essay, Outline, Like, Comment } from './features/essay/essaySlice';
export type EssayComment = Comment;
export type EssayLike = Like;
export type EssayContentType = Outline;
export type EssayType = Essay;
