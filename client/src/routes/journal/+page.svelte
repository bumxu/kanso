<script lang="ts">
    import { onMount } from 'svelte';
    import JournalEntry from '$lib/JournalEntry.svelte';
    //import Row from './Row.svelte';

    let entries: [] = [];

    onMount(async () => {
        const response = await fetch('http://localhost:3000/journal/entries');
        entries = await response.json();

        console.log(entries);
    });

    function add() {
        entries = [...entries, {
            createdAt: new Date().toISOString(),
            createdAtShowsTime: true,
            topic: '',
            //'status': null,
            updates: [],
            entities: []
        }];
    }

    function del(evt: CustomEvent) {
        entries = entries.filter(e => e !== evt.detail.entry);
    }
</script>

<svelte:head>
    <title>Diario de trabajo</title>
    <meta name="description" content="Diario de trabajo" />
</svelte:head>

<div class="x-container">
    <h1>J3</h1>

    <table class="x-journal-table">
        <thead>
        <tr>
            <th style="width: 1px"></th>
            <th style="width: 7px"></th>
            <th style="width: 115px">Apertura</th>
            <th style="width: 90%">Asunto</th>
            <th style="width: 100%">Actualizaciones</th>
            <th style="width: 60%">Entidades</th>
            <th style="width: 100px">Estado</th>
            <th style="width: 115px">Cierre</th>
            <th style="width: 20px"></th>
        </tr>
        </thead>
        <tbody>
        {#each entries as entry}
            <JournalEntry entry={entry} on:delete={del} />
        {/each}
        </tbody>
    </table>

    <button on:click={add}>+</button>


</div>

<style lang="scss">

  // td, th {
  //     border: 1px solid #000;
  // }

  // :global(.x-journal-table) {
  //     width: 100%;
  //     margin: 0 auto;
  //     border-collapse: collapse;
  //     display: grid;
  //     grid-template-columns: min-content min-content min-content 200fr 250fr 80fr 50fr min-content min-content;
  // }

  // :global(thead, tbody, tr) {
  //     display: contents;
  // }

  // .x-journal-table, .x-journal-table th, .x-journal-table td {
  //     border: 1px solid #aaa;
  // }

  // .x-journal-table, .x-journal-table input, .x-journal-table textarea {
  //     font-family: 'Roboto', sans-serif;
  //     font-weight: 400;
  //     resize: none;
  // }


</style>