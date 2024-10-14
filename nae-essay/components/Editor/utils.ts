import { $isRangeSelection, EditorState, RangeSelection } from 'lexical';

export function $isRangeSelected(selection: EditorState['_selection']): selection is RangeSelection {
    return $isRangeSelection(selection) && !selection.anchor.is(selection.focus);
}

export function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
    let timeoutID: number | undefined;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutID);
        timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
}
