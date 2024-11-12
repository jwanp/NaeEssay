import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';

import { EditorState, LexicalEditor } from 'lexical';
export default function MyOnSavePlugin({
    onSaveContent,
    saveKey,
    idx,
}: {
    onSaveContent: (editor: LexicalEditor, idx: number) => void;
    saveKey: number;
    idx: number;
}) {
    const [editor] = useLexicalComposerContext();
    const previousSaveKey = useRef(saveKey); // Store the previous saveKey

    useEffect(() => {
        // Only execute onSaveContent when saveKey changes (incremented)
        if (saveKey > 0 && saveKey !== previousSaveKey.current) {
            previousSaveKey.current = saveKey; // Update the previous saveKey
            onSaveContent(editor, idx);
        }
    }, [saveKey, onSaveContent]); // Depend on saveKey and other relevant dependencies

    return null;
}
