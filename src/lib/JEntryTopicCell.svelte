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
    }

    function handleChange() {
        value = inputValue;
    }

</script>

<div class="x-cell-wrapper">

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
             onchange={handleChange}
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