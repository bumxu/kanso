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

    function add() {
        updates .push( { id: nanoid(10), body: '' });
    }

    function del(id: string) {
        updates = updates.filter(e => e.id !== id);
    }
</script>

{#each updates as update, i (update.id)}
    <JEntryUpdate bind:value={updates[i]} ondelete={del} />
{/each}
<button class="x-add" onclick={add}>
    <i class="fas fa-caret-down fa-sm"></i>
</button>