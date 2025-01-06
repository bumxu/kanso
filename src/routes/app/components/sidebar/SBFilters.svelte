<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Codemirror from '$lib/components/Codemirror.svelte';
    import Ic from '$lib/components/Ic.svelte';
    import { includes } from '$lib/helpers/runtime.helper.js';
    import { filtersStore } from '$lib/stores/filters.store.j4.svelte.js';
    import type { BasicFilterSchema, BasicFiltersSchema } from '$lib/types/j4_types';

    type Props = {
        basicFilters: BasicFiltersSchema;
    }

    let { basicFilters = $bindable() }: Props = $props();

    let filterValue = $state('');
    let view = $derived.by(() => {
        const sorted = Object.values(basicFilters).sort((a, b) => a.desc.localeCompare(b.desc));
        const filtered = sorted.filter((basicFilter) => includes(basicFilter.desc, filterValue));
        return filtered;
    });

    let selected: BasicFilterSchema | undefined = $state();

    let filterFnValid = $derived.by(() => {
        try {
            new Function(selected.filterFn);
            return true;
        } catch (e) {
            console.warn('Invalid filter function', e);
            return false;
        }
    });

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

    function handleClearFilter() {
        filterValue = '';
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-filters"></i>
        Filtros básicos
    </div>

    <div class="x-bar">
        <Button icon="fas fa-fw fa-plus" onclick={add}>Nuevo</Button>
        <div class="flex-1"></div>
        <input class="txinp x-search" type="text" placeholder="Filtrar..." bind:value={filterValue} />
        <Ic iconclass="fad fa-sm fa-delete-left ms-4 me-2"
            label="Limpiar"
            onclick={handleClearFilter} />
    </div>

    <ul class="x-list">
        {#each Object.values(view) as basicFilter, i (basicFilter.id)}
            <li class="x-list-item">
                <input type="checkbox" id="basicFilter_{basicFilter.id}" bind:checked={basicFilter.active}>
                <button class="x-item" onclick={() => handleSelectItem(basicFilter)}>{basicFilter.desc}</button>
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

            <label for="et_filter">Descripción</label>
            <input type="text" id="et_filter" bind:value={selected.desc}>

            <label for="et_filterfn">Filter Function</label>
            <!--            <textarea id="et_filterfn" wrap="off" bind:value={selected.filterFn}></textarea>-->

            <div class="x-tx-wrapper" class:invalid={!filterFnValid}>
                <Codemirror bind:value={selected.filterFn} height="150px" />
            </div>

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
    .x-bar {
        border-bottom: 1px solid rgba(#000, 0.2);
        padding: 2px;
        display: flex;
    }

    .x-tx-wrapper {
        border: 1px solid rgba(#000, 0.2);
        border-radius: 1px;
        box-sizing: border-box;
        overflow: hidden;

        &.invalid {
            box-shadow: 0 0 1px 2px #a00;
            border-color: transparent;
        }
    }

</style>
