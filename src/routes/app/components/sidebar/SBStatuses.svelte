<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Ic from '$lib/components/Ic.svelte';
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte.js';
    import type { StatusSchema, StatusesSchema, EntitySchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';
    import { onMount } from 'svelte';

    type Props = {
        statuses: StatusesSchema;
    }

    let { statuses = $bindable() }: Props = $props();

    let filterValue = $state('');
    let view: StatusSchema[] = $derived.by(() => {
        const sorted = Object.values(statuses).sort((a, b) => a.name.localeCompare(b.name));
        const filtered = sorted.filter((status) => status.name.toLowerCase().includes(filterValue.toLowerCase()));
        return filtered;
    });

    let selected: StatusSchema | undefined = $state();

    function handleSelectItem(status: StatusSchema) {
        selected = status;
        console.debug('Selected status -> ' + status.id);
    }

    function add() {
        statusesStore.add({
            name: 'Nuevo estado',
            final: false
        });
    }

    function handleClearFilter() {
        filterValue = '';
    }

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-percent"></i>
        Estados
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
        {#each view as status, i (status.id)}
            <li class="x-list-item">
                <button class="x-item cursor-pointer"
                        title="Eliminar"
                        onclick={() => handleSelectItem(status)}>
                    <i class="fas fa-fw fa-2xs fa-percent"></i>{status.name}
                </button>
                <!--                <i class="fas fa-sm fa-fw fa-trash" onclick={() => statusesStore.delete(status.id)}></i>-->
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

            <label for="status_name">Nombre</label>
            <input type="text" id="status_name" class="txinp" bind:value={selected.name}>

            <label for="status_final">Final</label>
            <input type="checkbox" id="status_final" bind:checked={selected.final}>

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

</style>
