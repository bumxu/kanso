<script lang="ts">
    import JEntry from '$lib/journal_table/JEntry.svelte';
    import type { WindowSchema } from '$lib/types/j4_types';

    const { entriesWindow }: {
        entriesWindow: WindowSchema
    } = $props();

</script>

{#each entriesWindow.entries as entry}
    <JEntry {entry} />
{/each}