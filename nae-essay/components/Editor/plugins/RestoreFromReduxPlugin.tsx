import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { clearHtml } from '@/lib/features/essay/essaySlice';

export default function RestoreFromReduxPlugin({ idx }: { idx: number }) {
    const [editor] = useLexicalComposerContext();
    const essay = useAppSelector((state) => state.essay);
    const editorHtml: string | undefined = essay.content[idx]?.htmlString;
    const editorContent = essay.content[idx]?.content;
    const dispatch = useAppDispatch();

    // Use a ref to track if the effect has already run
    const hasRunRef = useRef(false);

    useEffect(() => {
        // Only run the effect if it hasn't run before
        if (editorHtml && !editorContent && !hasRunRef.current) {
            hasRunRef.current = true; // Mark as run

            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(editorHtml, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);
                const root = $getRoot();
                root.clear();
                $getRoot().select();
                $insertNodes(nodes);
            });
            dispatch(clearHtml()); // Clear HTML after inserting
        }
    }, [editorHtml, editorContent, dispatch, editor]); // Dependencies

    return null;
}
