<script lang="ts">
    export let value: number | null = null;

    let domInput: HTMLInputElement;
    let focused = false;

    export function handleFocus() {
        domInput.focus();
        domInput.select();
        focused = true;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="x-cell-wrapper x-input-wrapper"
     class:focused={focused}
     on:click={handleFocus}
>
    <input bind:this={domInput}
           bind:value="{value}"
           on:focus={handleFocus}
           on:blur={()=>{focused = false}}
           on:change />
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .x-input-wrapper {
        cursor: text;
        &:hover {
            background: rgba(0, 0, 0, 0.03);
        }
        &.focused {
            background-color: #ffffD6;
        }
    }

    input {
        text-align: center;
        width: 100%;
        padding: 0;
    }
</style>