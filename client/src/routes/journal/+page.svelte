<script lang="ts">
	import { onMount } from 'svelte';
	import JournalRow from "$lib/JournalRow.svelte";
	//import Row from './Row.svelte';

	let data: [] = [];

	onMount(async () => {
		const response = await fetch('http://localhost:3000/journal/search');
		data = await response.json();
	});
</script>

<svelte:head>
	<title>Diario de trabajo</title>
	<meta name="description" content="Diario de trabajo" />
</svelte:head>

<div class="text-column">
	<h1>Diario de trabajo</h1>

	<table class="x-journal-table">
		<thead>
		<tr>
			<th>Apertura</th>
			<th>Origen</th>
			<th>Asunto</th>
			<th>Actualizaciones</th>
			<th>Ubicaciones</th>
			<th>Estado</th>
			<th>Cierre</th>
		</tr>
		</thead>
		<tbody>
		<JournalRow />
		{#each data as item}
			<JournalRow item={item}/>
		{/each}
		</tbody>
	</table>

</div>

<style>
	
	:global(.x-journal-table) {
		width: 100%;
		margin: 0 auto;
		border-collapse: collapse;
		display: grid;
    	grid-template-columns: min-content 80fr 200fr 250fr 80fr 80fr min-content;
	}

	:global(thead, tbody, tr) {
		display: contents;
	}

	.x-journal-table, .x-journal-table th, .x-journal-table td {
		border: 1px solid #aaa;
	}

	.x-journal-table, .x-journal-table input, .x-journal-table textarea {
		font-family: 'Roboto', sans-serif;
		font-weight: 400;
		resize: none;
	}

	.x-journal-table tr {
		font-weight: 700;
		font-size: 14px;
		text-align: left;
	}

	.x-journal-table td {
		vertical-align: top;
	}

	.x-journal-table th {
		padding: 4px 5px;
	}
</style>