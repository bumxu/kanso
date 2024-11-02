<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte';
    import type { EntryUpdateSchema, EntryUpdatesSchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';
    import { onMount } from 'svelte';

    let {
        entryId,
        updates = $bindable()
    }: {
        entryId: string,
        updates: EntryUpdatesSchema
    } = $props();

    onMount(async () => {

    });

    function add(position: number) {
        journalStore.addUpdate(entryId, {}, position);
    }

    function del(id: string) {
        journalStore.delUpdate(entryId, id);
    }
</script>

<div class="x-cell-content">
    <SimpleBar tabindex="-1">
        <div class="x-separa" onclick={() => add(0)}></div>
        <div class="x-updates">
            {#each updates.data as update, i (update.id)}
                <JEntryUpdate bind:value={updates.data[i]} ondelete={del} />
                <div class="x-separa" onclick={() => add(i+1)}></div>
            {/each}
        </div>
    </SimpleBar>
</div>

<style lang="scss">
    .x-cell-content {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    //.x-updates {
    //    position: absolute;
    //    right: 0;
    //    top: 0;
    //    left: 0;
    //    bottom: 0;
    //    overflow: visible;
    //}

    .x-separa {
        height: 0;
        border-bottom: 1px dotted var(--table-sep-color);
        position: relative;
        z-index: 20;

        &:first-of-type {
            border-color: transparent;
        }

        &::before {
            content: '';
            display: block;
            height: 5px;
            width: 100%;
            position: absolute;
            top: -2px;
            cursor: pointer;
        }

        &:hover::before {
            background-color: rgba(26, 166, 94, 0.3);
        }
    }

    .x-add {
        //display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5em;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 0.5em;
        cursor: pointer;
        display: none;
    }
</style>