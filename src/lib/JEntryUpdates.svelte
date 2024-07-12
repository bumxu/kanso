<script lang="ts">
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import type { EntreUpdateSchema, EntrySchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';
    import { onMount } from 'svelte';

    let {
        entryId,
        updates = $bindable()
    }: {
        entryId: string,
        updates: EntreUpdateSchema[]
    } = $props();

    onMount(async () => {

    });

    function add(position: number) {
        updates.splice(position, 0, { id: nanoid(10), body: '' });
    }

    function del(id: string) {
        updates = updates.filter(e => e.id !== id);
    }
</script>

<div class="x-cell x-cell-updates">
    <!--link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css" />
    <script src="https://unpkg.com/simplebar@latest/dist/simplebar.min.js"></script-->

    <div class="x-separa" onclick={() => add(0)}></div>
    <div class="x-updates" data-simplebarx>
        {#each updates as update, i (update.id)}
            <JEntryUpdate bind:value={updates[i]} ondelete={del} />
            <div class="x-separa" onclick={() => add(i+1)}></div>
        {/each}
    </div>
    <!--    <button class="x-add" onclick={add}>-->
    <!--        <i class="fas fa-caret-down fa-sm"></i>-->
    <!--    </button>-->
</div>

<style lang="scss">
    .x-cell-updates {
        position: relative;
        height: 100%;
        overflow-y: scroll;
    }

    .x-updates {
        position: absolute;
        right: 0;
        top: 0;
        left: 0;
        bottom: 0;
        overflow: visible;
    }

    .x-separa {
        height: 0;
        border-bottom: 1px dashed #d9d9d9;
        position: relative;
        z-index: 20;

        &:first-of-type {
            border-color: transparent;
        }

        &::before {
            content: '';
            display: block;
            height: 3px;
            width: 100%;
            position: absolute;
            top: -1px;
            cursor: pointer;
        }

        &:hover::before {
            background-color: rgba(26, 166, 94, 0.3);
        }

        &:hover::after {
            background-color: rgba(26, 166, 94, 0.3);
            content: '';
            display: block;
            width: 11px;
            height: 11px;
            border-radius: 50%;
            position: absolute;
            top: -5px;
            cursor: pointer;
            right: 20px;
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