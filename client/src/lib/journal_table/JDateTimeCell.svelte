<script lang="ts">
    import JDateTime from '$lib/journal_table/JDateTime.svelte';

    let { isodate = $bindable() }
        : { isodate: string | undefined } = $props();

    let svtDateTime: JDateTime;
    let focused = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="x-cell-wrapper x-input-wrapper"
     class:focused={focused}
     on:click={()=>{svtDateTime.focus()}}
>
    <JDateTime bind:this={svtDateTime}
               value="{isodate}"
               onchange />
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
</style>