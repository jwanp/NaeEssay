import { ComponentProps, FC, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
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
import { changeContent, saveHtmlContent } from '@/lib/features/essay/essaySlice';

import { $getEditor, EditorState, LexicalEditor } from 'lexical';
import { FloatingMenuPlugin } from './plugins/FloatingMenu';
import { AutoLinkPlugin } from './plugins/LinkPlugin';
import editorTheme from './EditorThems';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import RestoreFromReduxPlugin from './plugins/RestoreFromReduxPlugin';

import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

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

import MyOnSavePlugin from './plugins/MyOnSavePlugin';

export default function Editor({ idx, saveKey }: { idx: number; saveKey: number }) {
    const dispatch = useAppDispatch();
    const essayId = useAppSelector((state) => state.essay._id);

    function onContentChange(editorState: EditorState, idx: number) {
        const editorStateJSON = editorState.toJSON();
        let plainText: string | null = null;

        plainText = editorState.read(() => $getRoot().getTextContent());
        dispatch(changeContent({ value: JSON.stringify(editorStateJSON), idx: idx, text: plainText }));
    }

    function onSaveContent(editor: LexicalEditor, idx: number) {
        let htmlString: string | null = null;
        htmlString = editor.getEditorState().read(() => $generateHtmlFromNodes(editor));
        dispatch(saveHtmlContent({ htmlString, idx }));
    }

    const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
        namespace: 'MyEditor',
        nodes: EDITOR_NODES,

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
            <MyOnSavePlugin onSaveContent={onSaveContent} saveKey={saveKey} idx={idx} />
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
