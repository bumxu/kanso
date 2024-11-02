<script lang="ts">
    import { filtersStore } from '$lib/stores/filters.store.j4.svelte.js';
    import type { BasicFilterSchema, BasicFiltersSchema } from '$lib/types/j4_types';

    type Props = {
        basicFilters: BasicFiltersSchema;
    }

    let { basicFilters = $bindable() }: Props = $props();

    let selected: BasicFilterSchema | undefined = $state();

    function handleSelectItem(basicFilter: BasicFilterSchema) {
        selected = basicFilter;
        console.debug('Selected type -> ' + basicFilter.id);
    }

    function add() {
        const basicFilter: BasicFilterSchema = filtersStore.add({
            id: '',
            desc: 'Nuevo filtro',
            filterFn: '(entry) => true',
            active: false
        });
        selected = basicFilter;
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-filters"></i>
        Filtros básicos
    </div>

    <button onclick={add}>+</button>
    <ul class="x-item-list">
        {#each Object.values(basicFilters) as basicFilter, i (basicFilter.id)}
            <div style="display: flex">
                <input type="checkbox" id="basicFilter_{basicFilter.id}" bind:checked={basicFilter.active}>
                <button class="x-item" onclick={() => handleSelectItem(basicFilter)}>{basicFilter.desc}</button>
            </div>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="et_id">#</label>
            <input type="text" id="et_id" bind:value={selected.id} readonly disabled>

            <label for="et_filter">Descripción</label>
            <input type="text" id="et_filter" bind:value={selected.desc}>

            <label for="et_filterfn">Filter Function</label>
            <textarea id="et_filterfn" wrap="off" bind:value={selected.filterFn}></textarea>

            <label for="et_active">Activado</label>
            <input type="checkbox" id="et_active" bind:checked={selected.active}>
        {:else}
            <div class="x-no-selection">
                <i class="fas fa-fw fa-hand-back-point-up"></i> Seleccione un elemento para editar
            </div>
        {/if}
    </div>
</div>

<style lang="scss">

    .x-item-list {
        background: #fff;
        height: 120px;
        overflow: auto;
        padding: 0;
        margin: 0;

        li {
            list-style: none;
            padding: 0;
            margin: 0;
        }
    }

    textarea {
        overflow: auto;
    }

    .x-item {
        cursor: pointer;
        display: block;
        border: none;
        background-color: transparent;
    }

</style>
