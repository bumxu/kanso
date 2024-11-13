<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte.js';
    import type { EntrySchema, EntryUpdatesSchema } from '$lib/types/j4_types';
    import { type SvelteComponent, tick } from 'svelte';
    import JEntryUpdate from './JEntryUpdate.svelte';

    type Props = {
        entry: EntrySchema,
        onchange?: () => void
    };
    let { entry, onchange }: Props = $props();

    // DOM
    let domItems: SvelteComponent[] = $state([]);
    $effect(() => {domItems = [];});

    async function add(position: number) {
        journalStore.addUpdate(entry.id, {}, position);
        await tick();
        domItems[position].focus();
    }

    function del(id: string) {
        journalStore.delUpdate(entry.id, id);
    }

    function handleChange() { if (onchange) onchange(); }

    function handleClickCell(ev: MouseEvent) {
        if (entry.updates.data.length === 0) {
            add(0);
        } else if (domItems.length > 0) {
            domItems[domItems.length - 1].focus();
        }
    }

    function handleItemBlur() {
        if (entry.updates.data.length === 1 && !entry.updates.data[0].body && !entry.updates.data[0].date) {
            del(entry.updates.data[0].id);
        }
    }
</script>

<div class="x-cell-content" role="none" onclick={handleClickCell}>
    <SimpleBar tabindex="-1">
        <div class="x-inlay" onclick={() => add(0)}></div>
        <div class="x-updates">
            {#each entry.updates.data as update, i (update.id)}
                <JEntryUpdate bind:value={entry.updates.data[i]} ondelete={del}
                              bind:this={domItems[i]}
                              onblur={handleItemBlur}
                              onchange={handleChange} />
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
        transition: background-color 0.2s;

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