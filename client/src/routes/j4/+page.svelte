<script lang="ts">
    import JEntriesWindow from '$lib/journal_table/JEntriesWindow.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte';
    import { storeManager } from '$lib/stores/store.j4.svelte';
    import { ztags } from '$lib/stores/tags_store';
    import { zentities } from '$lib/stores/j3_entities_store';
    import type { EntrySchema } from '$lib/types/j4_types';
    import type { JEntry } from '$lib/types/JEntry';
    import { Utils } from '$lib/Utils';
    import { DateTime } from 'luxon';
    import { onMount, tick } from 'svelte';
    import JournalEntry from '$lib/journal_table/JEntry.svelte';
    import { SERVER_HOST } from '$lib/constants';
    //import Row from './Row.svelte';

    //let entries: JEntry[] = [];
    let journal = $derived(journalStore.journal);

    onMount(async () => {
        console.log('Iniciando J4...');

        storeManager.loadToLS();

        // const response = await fetch(SERVER_HOST + '/api/journal/entries');
        // $entries = [...await response.json()];
        // console.log('Obtenidos ' + $entries.length + ' registros');
        //
        // const response2 = await fetch(SERVER_HOST + '/api/journal/tags');
        // const tags = [...await response2.json()];
        // $ztags = tags;
        // console.log('Obtenidas ' + tags.length + ' tags');
        //
        // const response3 = await fetch(SERVER_HOST + '/api/journal/entities');
        // const entities = [...await response3.json()];
        // $zentities = entities;
        // console.log('Obtenidas ' + entities.length + ' entidades');
        //
        // console.log(entries);

    });

    function add() {
        //     $entries = [...$entries, {
        //         createdAt: Utils.formatDateServer(DateTime.now())!,
        //         createdAtShowsTime: true,
        //         closedAtShowsTime: false,
        //         priority: null,
        //         topic: '',
        //         updates: [],
        //         entities: [],
        //         tags: []
        //     }];
        journalStore.add({
            dateSince: '20240602',
            subject: 'Nuevo asunto ' + Math.random(),
            updates: [],
            tags: [],
            status: 'active'
        });
    }

    function del(evt: CustomEvent) {
        //     $entries = $entries.filter(e => e !== evt.detail.entry);
    }

    function handlePartitionChange(entry: EntrySchema, srcPartId: string) {
        entry = $state.snapshot(entry);

        console.log('Partition change', entry, srcPartId);
        const dstPartId = entry.dateSince.substring(0, 6);

        // Remove from old partition
        journalStore.journal[srcPartId].entries = journalStore.journal[srcPartId].entries.filter(e => e.id !== entry.id);

        // Add to new partition
        if (!journalStore.journal[dstPartId]) {
            journalStore.journal[dstPartId] = { id: dstPartId, entries: [] };
        }
        journalStore.journal[dstPartId].entries.push(entry);
        journalStore.journal[dstPartId].entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
    }
</script>

<svelte:head>
    <title>Diario de trabajo</title>
    <meta name="description" content="Diario de trabajo" />
</svelte:head>

<div class="x-container">

    <div class="x-main">
        <h1>J4</h1>

        <button onclick={add}>Add sample</button>
        <button onclick={()=>journalStore.serialize()}>Serialize</button>
        <button onclick={() => storeManager.loadToLS()}>Load (LS)</button>
        <button onclick={() => storeManager.saveToLS()}>Save (LS)</button>
        <br><br>

        <div class="x-table x-journal">
            <div class="x-row x-header">
                <div></div>
                <div></div>
                <div>Desde</div>
                <div>Asunto</div>
                <div>Actualizaciones</div>
                <div>Entidades</div>
                <div>Tags</div>
                <div>P</div>
                <div>F. Objetivo</div>
                <div>F. Cierre</div>
                <div>Estado</div>
                <div></div>
            </div>
            {#each Object.keys(journal) as partId, partIdx (partId)}
                <JEntriesWindow bind:entriesWindow={journal[partId]}
                                onpartitionchange={handlePartitionChange}
                />
            {/each}
        </div>
    </div>

    <div class="x-sidebar">
        a
    </div>

</div>

<style lang="scss">
    .x-container {
        display: flex;
        flex-direction: row;
        width: 100vw;
    }

    .x-main {
        flex: 1 0 auto;
    }

    .x-sidebar {
        flex: 0 0 200px;
        height: 100vh;
        background-color: #f0f0f0;
    }
</style>