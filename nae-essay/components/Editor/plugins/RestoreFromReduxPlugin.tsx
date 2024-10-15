import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useAppSelector } from '@/lib/hooks';
import { EditorState } from 'lexical';
//https://github.com/facebook/lexical/discussions/1937
export default function RestoreFromReduxPlugin({ idx }: { idx: number }) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [editor] = useLexicalComposerContext();
    const essay = useAppSelector((state) => state.essay);
    const editorContent: string = essay.content[idx].content;
    useEffect(() => {
        if (isFirstRender && editorContent) {
            const initialEditorState: EditorState = editor.parseEditorState(editorContent);
            editor.setEditorState(initialEditorState);
            setIsFirstRender(false);
        }
    }, [isFirstRender, editorContent]);
    return null;
}
