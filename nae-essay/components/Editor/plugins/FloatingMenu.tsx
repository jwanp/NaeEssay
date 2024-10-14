import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { $isLinkNode } from '@lexical/link';
import { $getSelection, FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import { computePosition } from '@floating-ui/dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { IconButton } from '@/components/Buttons/IconButton';

import { $isRangeSelected } from '../utils';
import { useUserInteractions } from '../hooks';

type FloatingMenuPosition = { x: number; y: number } | undefined;

type FloatingMenuProps = {
    editor: LexicalEditor;
    show: boolean;
    isBold: boolean;
    isCode: boolean;
    isItalic: boolean;
    isStrikeThrough: boolean;
    isUnderLine: boolean;
};

function FloatingMenu({ show, ...props }: FloatingMenuProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<FloatingMenuPosition>(undefined);

    // 선택된 텍스트의 범위를 나타내는 Selection 객체를 반환한다.
    const nativeSel = window.getSelection();

    // 선택된 텍스트의 위치를 계산하는 useEffect
    useEffect(() => {
        // 클릭만 했을때 rangeCount is 1, 선택된 text가 없을땐 isCollapsed 는 false
        const isCollapsed = nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

        if (!show || !ref.current || !nativeSel || isCollapsed) {
            setPos(undefined);
            return;
        }
        const domRange = nativeSel.getRangeAt(0);

        // domRange는 기준이 되는 element, ref.current 는 floating element
        computePosition(domRange, ref.current, { placement: 'top' })
            .then((pos) => {
                setPos({ x: pos.x, y: pos.y - 10 });
            })
            .catch(() => {
                setPos(undefined);
            });
        // anchorOffset은 선택이 시작된 지점이다. 새로 선택하게 되면 position을 다시 계산한다.
    }, [show, nativeSel, nativeSel?.anchorOffset]);

    return (
        <div
            ref={ref}
            style={{ top: pos?.y, left: pos?.x }}
            aria-hidden={!pos?.x || !pos?.y}
            className={`absolute flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1 ${pos?.x && pos?.y ? 'opacity-1 visible' : 'opacity-0 invisible'}`}>
            <IconButton
                icon="bold"
                aria-label="Format text as bold"
                active={props.isBold}
                onClick={() => {
                    props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}></IconButton>
            <IconButton
                icon="italic"
                aria-label="Format text as italics"
                active={props.isItalic}
                onClick={() => {
                    props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
            />
            <IconButton
                icon="underline"
                aria-label="Format text to underlined"
                active={props.isUnderLine}
                onClick={() => {
                    props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
            />
            <IconButton
                icon="strike"
                aria-label="Format text with a strikethrough"
                active={props.isStrikeThrough}
                onClick={() => {
                    props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
            />
            <IconButton
                icon="code"
                aria-label="Format text with inline code"
                active={props.isCode}
                onClick={() => {
                    props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }}
            />
        </div>
    );
}

export function FloatingMenuPlugin() {
    const [isMounted, setIsMounted] = useState(false);
    const [show, setshow] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const { isPointerDown, isKeyDown } = useUserInteractions();
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // floating Menu는 언제 update 되어야 하나.
    const updateFloatingMenu = useCallback(() => {
        editor.getEditorState().read(() => {
            // editor를 변경하고 있거나 마우스를 누르고 있거나 키보드를 누르고 있다면 업데이트를 하지 않는다.
            if (editor.isComposing() || isPointerDown || isKeyDown) return;
            // 선택된 div box 가 아니라면 floating menu를 보여주지 않는다.
            if (editor.getRootElement() !== document.activeElement) {
                setshow(false);
                return;
            }

            const selection = $getSelection();

            if ($isRangeSelected(selection)) {
                // FloatingMenu 에서 button 을 누르면 selection을 바꾼다.
                // FloatingMenuPlugin은 selection을 통해서 isBold 등을 설정한다.
                // FloatingMenu 는 Plugin에서 전달받은 isBold 등을 통해서 active 설정을 한다.
                setIsBold(selection.hasFormat('bold'));
                setIsCode(selection.hasFormat('code'));
                setIsItalic(selection.hasFormat('italic'));
                setIsUnderline(selection.hasFormat('underline'));
                setIsStrikethrough(selection.hasFormat('strikethrough'));
                setshow(true);
            } else {
                setshow(false);
            }
        });
    }, [editor, isPointerDown, isKeyDown]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updateFloatingMenu();
        });
    }, [editor, updateFloatingMenu]);

    useEffect(() => {
        updateFloatingMenu();
    }, [isPointerDown, isKeyDown, updateFloatingMenu]);

    if (isMounted == false) {
        return null;
    }

    return createPortal(
        <FloatingMenu
            editor={editor}
            show={show}
            isBold={isBold}
            isCode={isCode}
            isItalic={isItalic}
            isStrikeThrough={isStrikethrough}
            isUnderLine={isUnderline}
        />,
        document.body
    );
}
