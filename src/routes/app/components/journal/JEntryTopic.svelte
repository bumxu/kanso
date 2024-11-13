<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import type { EntrySchema } from '$lib/types/j4_types';

    type Props = {
        /** La entrada del diario. */
        entry: EntrySchema,
        /** Un listener que se ejecutará cuando se modifique el campo. Opcional. */
        onchange?: () => void,
    }
    let { entry, onchange }: Props = $props();

    /** Indica si el campo de entrada tiene el foco. */
    let hasFocus: boolean = $state(false);
    /** DOM del campo de entrada. */
    let domTopicCe: HTMLDivElement;

    // Edición diferida (desactivado)
    //let inputValue: string = $state(entry.subject);
    // $effect(() => {
    //     //inputValue = value;
    // });

    export function focus() { domTopicCe.focus(); }

    function handleFocusInput() { hasFocus = true; }
    function handleBlurInput() { hasFocus = false; }

    function handleChange() { if (onchange) onchange(); }

    /** Limpia el formato cuando se pega texto en la entrada. */
    function handlePasteInput(ev: ClipboardEvent) {
        ev.preventDefault();
        document.execCommand('insertText', false, ev.clipboardData?.getData('text/plain'));
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="x-cell-content" class:focused={hasFocus} role="none" onclick={()=>domTopicCe.focus()}>
    <SimpleBar tabindex="-1">
        <div class="x-text-input" contenteditable="true" bind:textContent={entry.subject}
             spellcheck="false" role="textbox" tabindex="0"
             bind:this={domTopicCe}
             onfocus={handleFocusInput}
             onblur={handleBlurInput}
             onpaste={handlePasteInput}
             oninput={handleChange}></div>
    </SimpleBar>
</div>

<style lang="scss">
    .x-cell-content {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: text;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--color-hovered);
        }

        &.focused {
            background-color: var(--color-focused);
        }
    }

    .x-text-input {
        display: inline-block;
        font-size: 10.6px;
        font-weight: 450;
        letter-spacing: -0.2px;
        line-height: 1.6;
        white-space: pre-wrap;
        text-rendering: optimizeLegibility;
        resize: none;
        box-sizing: border-box;
        padding: 1px 3px 4px;
        border: 0;
        min-width: 100%;
        outline: 0;

        &:not(:focus):empty:before {
            content: '(( Nuevo ))';
            color: rgba(0, 0, 255, 0.71);
            font-weight: 600;
            position: absolute;
            pointer-events: none;
        }
    }
</style>

