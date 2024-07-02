<script lang="ts">
    import JDateTime from '$lib/journal_table/JDateTime.svelte';

    type Props = {
        value: string,
        onchange?: () => void
    };

    let { value = $bindable(), onchange }: Props = $props();

    let svtDateTime: JDateTime;
    let focused = $state(false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="x-cell-wrapper x-input-wrapper"
     class:focused={focused}
     onclick={()=>{svtDateTime.focus()}}
>
    <JDateTime bind:this={svtDateTime}
               bind:value={value}
               onchange={() => { if (onchange) onchange(); }}
               onfocus={() => focused = true}
               onblur={() => focused = false}
    />
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