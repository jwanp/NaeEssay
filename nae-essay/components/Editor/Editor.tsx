import { ComponentProps, FC, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import MyOnChangePlugin from '@/components/Editor/plugins/MyOnChangePlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { CodeHighlightNode } from '@lexical/code';

import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';

import { validateUrl } from '@/utils/string';

import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeContent } from '@/lib/features/essay/essaySlice';

import { $getEditor, EditorState } from 'lexical';
import { FloatingMenuPlugin } from './plugins/FloatingMenu';
import { AutoLinkPlugin } from './plugins/LinkPlugin';
import editorTheme from './EditorThems';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import RestoreFromReduxPlugin from './plugins/RestoreFromReduxPlugin';

const EDITOR_NODES = [
    AutoLinkNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
];

export default function Editor({ idx }: { idx: number }) {
    const dispatch = useAppDispatch();
    const essay = useAppSelector((state) => state.essay);
    // PlugIn 을 따로 만들어서 저장한다.
    // const initialEditorState: JSON = JSON.parse(essay.content[idx].content);

    function onContentChange(editorState: EditorState, idx: number) {
        const editorStateJSON = editorState.toJSON();
        dispatch(changeContent({ value: JSON.stringify(editorStateJSON), idx: idx }));
    }

    // const editorStateRef = useRef<EditorState | undefined>(undefined);

    const saveEssayContent = (value: string, idx: number) => {
        dispatch(changeContent({ value, idx }));
    };

    const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
        namespace: 'MyEditor',
        nodes: EDITOR_NODES,
        // theme: {
        //     link: 'cursor-pointer underline text-blue-600 hover:text-blue-800 visited:text-purple-600',
        //     text: {
        //         bold: 'font-semibold',
        //         underline: 'underline',
        //         italic: 'italic',
        //         strikethrough: 'line-through',
        //         underlineStrikethrough: 'underlined-line-through',
        //     },
        //     list: {
        //         ul: styles.ul,
        //         ol: styles.ol,
        //         listitem: styles.listitem,
        //         nested: {
        //             listitem: styles.nestedListItem,
        //         },
        //         listitemChecked: styles.listitemChecked,
        //         listitemUnchecked: styles.listitemUnchecked,
        //     },
        // },
        theme: editorTheme,
        onError: (error) => console.error(error),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative pt-6 pl-2 ">
                <RichTextPlugin
                    contentEditable={<ContentEditable spellCheck={false} className="outline-none" />}
                    placeholder={
                        <div className="absolute text-gray-400 top-6 left-2 pointer-events-none select-none">
                            글을 써주세요
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}></RichTextPlugin>
            </div>
            {/* <OnChangePlugin
                onChange={(editorState) => {
                    editorStateRef.current = editorState; // database 에 저장 하려면 .toJSON 과 JSON.stringfy 를 이용해야한다.
                }}
            /> */}
            <MyOnChangePlugin onChange={onContentChange} idx={idx} />
            <button
                onClick={() => {
                    // if (editorStateRef.current) {
                    //     saveEssayContent(JSON.stringify(editorStateRef.current), idx);
                    // }
                }}></button>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ListPlugin />
            <FloatingMenuPlugin />
            <LinkPlugin validateUrl={validateUrl} />
            <AutoLinkPlugin />
            {/* <CodeHighlightPlugin /> */}
            <LexicalClickableLinkPlugin newTab={true} disabled={false} />
            <RestoreFromReduxPlugin idx={idx} />
        </LexicalComposer>
    );
}
