<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';

    type Props = {
        entryId: string;
        value: string;
    }
    let { value = $bindable(), entryId }: Props = $props();

    let inputValue: string = $state(value);
    let hasFocus: boolean = $state(false);

    // DOM
    let domTopicCe: HTMLDivElement;

    function handleBlur() {
        hasFocus = false;
        handleChange();
    }

    function handleChange() {
        if (inputValue !== value) {
            value = inputValue;
            // Remove html
            inputValue = inputValue.replace(/<[^>]*>?/gm, '');
            console.log(`Modificación del asunto de la entrada #${entryId} consolidada -> ` + value);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            domTopicCe.blur();
        } else if (event.key === 'Escape') {
            if (inputValue !== value) {
                inputValue = value;
                domTopicCe.blur();
                console.log(`Modificación del asunto de la entrada #${entryId} cancelada -> ` + value);
            }
        }
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="x-cell-wrapper" class:x-focused={hasFocus} role="none" onclick={()=>domTopicCe.focus()}>
    <SimpleBar tabindex="-1">
        <div class="x-body-ce" contenteditable="true" bind:textContent={inputValue}
             spellcheck="false"
             role="textbox"
             tabindex="0"
             bind:this={domTopicCe}
             onkeydown={handleKeydown}
             onfocus={() => hasFocus = true}
             onblur={handleBlur}></div>
    </SimpleBar>
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: auto;
        box-sizing: border-box;
        cursor: text;
        transition: background-color 0.15s;

        &:hover {
            background-color: var(--color-hovered);
        }

        &.x-focused {
            background-color: var(--color-focused);
        }
    }

    .x-body-ce {
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

