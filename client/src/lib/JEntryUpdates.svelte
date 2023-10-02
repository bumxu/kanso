<script lang="ts">
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { onMount } from 'svelte';

    export let entry: number | undefined;
    export let updates: [] = [];

    onMount(async () => {

    });

    function add() {
        updates = [...updates, {body: ''}];
    }

    function del(evt: CustomEvent) {
        updates = updates.filter(e => e !== evt.detail.item);
    }
</script>

{#each updates as update}
    <JEntryUpdate bind:entry={entry} bind:value="{update}" on:delete={del} />
{/each}
<button class="x-add" on:click={add}>
    <i class="fas fa-caret-down fa-sm" />
</button>