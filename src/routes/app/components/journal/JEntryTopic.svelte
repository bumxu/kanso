<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';

    type Props = {
        entryId: string;
        value: string;
    }
    let { value = $bindable(), entryId }: Props = $props();

    let inputValue: string = $state(value);
    let hasFocus: boolean = $state(false);

    let domTopicCe: HTMLDivElement;

    function handleInputBlur() {
        hasFocus = false;
        applyInputValue();
    }

    function applyInputValue() {
        if (inputValue !== value) {
            value = inputValue;
            // Remove html
            inputValue = inputValue.replace(/<[^>]*>?/gm, '');
            console.log(`Modificación del asunto de la entrada #${entryId} consolidada -> "` + value + '"');
        }
    }

    function handleInputKeydown(ev: KeyboardEvent) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault();
            ev.stopPropagation();
            domTopicCe.blur();
        } else if (ev.key === 'Escape') {
            if (inputValue !== value) {
                inputValue = value;
                domTopicCe.blur();
                console.log(`Modificación del asunto de la entrada #${entryId} cancelada -> "` + value + '"');
            }
        }
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="x-cell-content" class:focused={hasFocus} role="none" onclick={()=>domTopicCe.focus()}>
    <SimpleBar tabindex="-1">
        <div class="x-text-input" contenteditable="true" bind:textContent={inputValue}
             spellcheck="false" role="textbox" tabindex="0" bind:this={domTopicCe}
             onfocus={() => hasFocus = true} onblur={handleInputBlur}
             onkeydown={handleInputKeydown}></div>
    </SimpleBar>
</div>

<style lang="scss">
    .x-cell-content {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: text;
        transition: background-color 0.15s;

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

