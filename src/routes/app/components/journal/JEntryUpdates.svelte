<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte.js';
    import type { EntryUpdatesSchema } from '$lib/types/j4_types';
    import { type SvelteComponent, tick } from 'svelte';

    type Props = { entryId: string, updates: EntryUpdatesSchema };
    let { entryId, updates = $bindable() }: Props = $props();

    // DOM
    let domItems: SvelteComponent[] = $state([]);
    $effect(() => {domItems = [];});

    async function add(position: number) {
        journalStore.addUpdate(entryId, {}, position);
        await tick();
        domItems[position].focus();
    }

    function del(id: string) {
        journalStore.delUpdate(entryId, id);
    }

    function handleCellClick(ev: MouseEvent) {
        if (updates.data.length === 0) {
            add(0);
        } else if (domItems.length > 0) {
            domItems[domItems.length - 1].focus();
        }
    }

    function handleItemBlur() {
        if (updates.data.length === 1 && !updates.data[0].body && !updates.data[0].date) {
            del(updates.data[0].id);
        }
    }
</script>

<div class="x-cell-content" role="none" onclick={handleCellClick}>
    <SimpleBar tabindex="-1">
        <div class="x-inlay" onclick={() => add(0)}></div>
        <div class="x-updates">
            {#each updates.data as update, i (update.id)}
                <JEntryUpdate bind:value={updates.data[i]} ondelete={del}
                              bind:this={domItems[i]}
                              onblur={handleItemBlur} />
                <div class="x-inlay" onclick={() => add(i+1)}></div>
            {/each}
        </div>
    </SimpleBar>
</div>

<style lang="scss">
    .x-cell-content {
        cursor: text;
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        width: 100%;

        &:hover {
            background-color: var(--color-hovered);
        }
    }

    .x-updates {
        overflow: hidden;
    }

    .x-inlay {
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