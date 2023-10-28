<script lang="ts">
    import { ztags } from '$lib/stores/tags_store';
    import { zentities } from '$lib/stores/entities_store';
    import type { JEntry } from '$lib/types/JEntry';
    import { Utils } from '$lib/Utils';
    import { DateTime } from 'luxon';
    import { onMount } from 'svelte';
    import JournalEntry from '$lib/journal_table/JEntry.svelte';
    import { SERVER_HOST } from '$lib/constants';
    //import Row from './Row.svelte';
    import { entries } from '$lib/stores/journal_store';

    //let entries: JEntry[] = [];

    onMount(async () => {
        console.log('Iniciando J3...');

        const response = await fetch(SERVER_HOST + '/api/journal/entries');
        $entries = [...await response.json()];
        console.log('Obtenidos ' + $entries.length + ' registros');

        const response2 = await fetch(SERVER_HOST + '/api/journal/tags');
        const tags = [...await response2.json()];
        $ztags = tags;
        console.log('Obtenidas ' + tags.length + ' tags');

        const response3 = await fetch(SERVER_HOST + '/api/journal/entities');
        const entities = [...await response3.json()];
        $zentities = entities;
        console.log('Obtenidas ' + entities.length + ' entidades');

        console.log(entries);
    });

    function add() {
        $entries = [...$entries, {
            createdAt: Utils.formatDateServer(DateTime.now())!,
            createdAtShowsTime: true,
            closedAtShowsTime: false,
            priority: null,
            topic: '',
            updates: [],
            entities: [],
            tags: []
        }];
    }

    function del(evt: CustomEvent) {
        $entries = $entries.filter(e => e !== evt.detail.entry);
    }
</script>

<svelte:head>
    <title>Diario de trabajo</title>
    <meta name="description" content="Diario de trabajo" />
</svelte:head>

<div class="x-container">
    <h1>J3</h1>

    <div class="x-table x-journal">
        <div class="x-row x-header">
            <div></div>
            <div></div>
            <div>Apertura</div>
            <div>Asunto</div>
            <div>Actualizaciones</div>
            <div>Entidades</div>
            <div>Tags</div>
            <div>P</div>
            <div>Cierre</div>
            <div>Estado</div>
            <div></div>
        </div>
        {#each $entries as entry}
            <JournalEntry entry={entry} on:delete={del} />
        {/each}
    </div>

    <button on:click={add}>+</button>


</div>

<style lang="scss">

</style>