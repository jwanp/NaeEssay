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

import { Essay, Outline, Like, Comment } from './features/essay/essaySlice';
export type EssayComment = Comment;
export type EssayLike = Like;
export type EssayContentType = Outline;
export type EssayType = Essay;
// export interface EssayContentType {
//     outline: string;
//     content?: string;
//     text: string;
//     htmlString?: string;
// }
// export interface EssayType {
//     _id: string;
//     topic: string;
//     topicId: string;
//     author: string;
//     email?: string;
//     date: string;
//     content: EssayContentType[];
//     public: boolean;
//     comment?: EssayComment[];
//     like?: EssayLike[];

//     commentCount?: number;
//     likeCount?: number;
// }

// export interface EssayLike {
//     _id?: ObjectId;
//     essayId: ObjectId;
//     email: ObjectId;
//     date: Date;
// }

// export interface EssayComment {
//     _id?: ObjectId;
//     essayId: ObjectId;
//     email: string;
//     content: string;
//     date: Date;
// }
