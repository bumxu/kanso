<script lang="ts">
    import autosize from 'autosize';
    import { onMount } from 'svelte';
    import tippy from 'tippy.js';

    let { value = $bindable() }:
        { value: string } = $props();

    let inputValue: string = $state(value);
    let hasFocus: boolean = $state(false);

    // DOM
    let domTopicCe: HTMLDivElement;

    // onMount(() => {
    //     console.log('v', value);
    // });

    // Hooks
    // $effect(() => {
    //     if (value !== inputValue) {
    //         inputValu    e = value;
    //         autosize(domTopicTextarea);
    //     }
    // });

    function handleBlur() {
        hasFocus = false;
        handleChange();
    }

    function handleChange() {
        value = inputValue;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            domTopicCe.blur();
        } else if (event.key === 'Escape') {
            inputValue = value;
            domTopicCe.blur();
        }
    }

</script>

<div class="x-cell x-cell-wrapper" >
    <link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css" />
    <script src="https://unpkg.com/simplebar@latest/dist/simplebar.min.js"></script>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!--div class="textarea-wrapper"
         bind:this={domTopicCe}
         class:hasFocus={hasFocus}
         onclick={()=>{domTopicCe.focus()}}
   -->

    <div class="x-body-ce" contenteditable="true" bind:textContent={inputValue}
         spellcheck="false"
         bind:this={domTopicCe}
         onkeydown={handleKeydown}
         onfocus={() => hasFocus = true}
         onblur={handleBlur}></div>

    <!--textarea bind:value={inputValue}
              onfocus={() => hasFocus = true}
              onblur={handleBlur}
              onchange={handleChange}
              spellcheck="false"></textarea-->
    <!--</div>-->
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        padding: 0 2px;
        position: relative;
        overflow: auto;
        padding-bottom: 12px;

        &::after {
            content: '';
            display: block;
            background: red;
            pointer-events: none;
            height: 18px;
            left: 0;
            right: 0;
            position: absolute;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%);
        }
    }

    .x-body-ce {
        display: inline-block;
        font-size: 11px;
        text-rendering: optimizeLegibility;
        resize: none;
        box-sizing: border-box;
        padding: 0;
        border: 0;
        min-width: 100%;
        outline: 0;

        &:hover, &:focus {
            background: rgba(0, 0, 0, 0.05);
        }

        &:not(:empty) {
            display: inline;
        }

        &:not(:focus):empty:before {
            content: '· · ·';
            color: rgba(0, 0, 0, 0.3);
            font-weight: 600;
            position: absolute;
            pointer-events: none;
        }
    }

    textarea {
        font-size: 0.68rem;
        font-weight: 400;
        transform: translateZ(0);
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
        text-rendering: optimizeLegibility;
        padding: 2px 4px;
        //line-height: 1.4;
    }
</style>

