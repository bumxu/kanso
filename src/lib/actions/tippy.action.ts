import type { Action } from 'svelte/action';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling

type Props = {
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
    content?: string;
}

export const tippyAction: Action<HTMLElement, Props | undefined> = (node, param: Props = {}) => {
    //console.log('myAction', node, param);
    tippy(node, {
        content: param.content ?? ((reference) => reference.getAttribute('title')),
        placement: param.placement
    });
};