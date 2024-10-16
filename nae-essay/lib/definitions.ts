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
