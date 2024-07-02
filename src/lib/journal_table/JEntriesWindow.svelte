<script lang="ts">
    import JEntry from '$lib/journal_table/JEntry.svelte';
    import type { EntrySchema, WindowSchema } from '$lib/types/j4_types';

    type Props = {
        entriesWindow: WindowSchema,
        onpartitionchange: (entry: EntrySchema, currPartId: string) => void
    };

    const { entriesWindow = $bindable(), onpartitionchange }: Props = $props();

</script>

{#each entriesWindow.entries as entry, i (entry.id)}
    <JEntry bind:entry={entriesWindow.entries[i]}
            partitionId={entriesWindow.id}
            onpartitionchange={onpartitionchange} />
{/each}