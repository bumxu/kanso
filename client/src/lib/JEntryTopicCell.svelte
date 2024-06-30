<script lang="ts">
    import autosize from 'autosize';
    import { createEventDispatcher, onMount } from 'svelte';
    import tippy from 'tippy.js';

    let { value = $bindable() }:
        { value: string } = $props();

    let inputValue: string = $state(value);
    let hasFocus: boolean = $state(false);

    // DOM
    let domTopicTextarea: HTMLTextAreaElement;

    // Hooks
    $effect(() => {
        if (value !== inputValue) {
            inputValue = value;
            autosize(domTopicTextarea);
        }
    });

    function handleBlur() {
        hasFocus = false;
    }

    function handleChange() {
        value = inputValue;
    }

</script>

<div class="x-cell-wrapper">

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="textarea-wrapper"
         class:hasFocus={hasFocus}
         onclick={()=>{domTopicTextarea.focus()}}
    >
        <textarea bind:this={domTopicTextarea}
                  bind:value={inputValue}
                  onfocus={() => hasFocus = true}
                  onblur={handleBlur}
                  onchange={handleChange} />
    </div>
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }

    textarea {
        font-family: 'Noto Sans', sans-serif;
        font-size: 0.68rem;
        font-weight: 400;
        transform: translateZ(0);
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
        text-rendering: optimizeLegibility;
        padding: 2px 4px;
        //line-height: 1.4;
    }
</style>