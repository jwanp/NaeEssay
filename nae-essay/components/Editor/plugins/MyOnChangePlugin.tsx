import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { OnChangePluginProps } from '@/lib/definitions';

export default function MyOnChangePlugin({ onChange, idx }: OnChangePluginProps): null {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState, idx);
        });
    }, [editor, onChange]);
    return null;
}
