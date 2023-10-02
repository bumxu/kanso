<script lang="ts">
    import autosize from 'autosize';
    import { createEventDispatcher, onMount } from 'svelte';
    import tippy from 'tippy.js';

    const dispatch = createEventDispatcher();

    export let value: string;
    let hasFocus: boolean = false;

    // DOM
    let domTopicTextarea: HTMLTextAreaElement;

    // Hooks
    onMount(() => {
        // Ajustamos el tamaño de los textarea
        autosize(domTopicTextarea);
    });

</script>

<div class="x-cell-wrapper">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="textarea-wrapper"
         class:hasFocus={hasFocus}
         on:click={()=>{domTopicTextarea.focus()}}
    >
        <textarea bind:this={domTopicTextarea}
                  bind:value={value}
                  on:input={() => dispatch('change')}
                  on:focus={() => hasFocus = true}
                  on:blur={() => hasFocus = false} />
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