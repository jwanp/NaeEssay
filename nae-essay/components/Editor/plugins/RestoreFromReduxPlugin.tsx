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

    
    const hasRunRef = useRef(false);

    useEffect(() => {
        
        if (editorHtml && !editorContent && !hasRunRef.current) {
            hasRunRef.current = true; 

            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(editorHtml, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);

                const root = $getRoot();
                root.clear();
                $getRoot().select();
                $insertNodes(nodes);
            });
            dispatch(clearHtml()); 
        }
    }, [editorHtml, editorContent, dispatch, editor]); 

    return null;
}
