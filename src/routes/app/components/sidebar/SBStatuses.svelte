<script lang="ts">
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte.js';
    import type { StatusSchema, StatusesSchema, EntitySchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';
    import { onMount } from 'svelte';

    type Props = {
        statuses: StatusesSchema;
    }

    let { statuses = $bindable() }: Props = $props();

    let orderedStatuses: StatusSchema[] = $derived.by(() => {
        return Object.values(statuses).sort((a, b) => a.name.localeCompare(b.name));
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

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-percent"></i>
        Estados
    </div>

    <button onclick={add}>+</button>
    <ul class="x-item-list">
        {#each orderedStatuses as status, i (status.id)}
            <li>
                <button class="x-item" onclick={() => handleSelectItem(status)}>{status.name}</button>
                <!--                <i class="fas fa-sm fa-fw fa-trash" onclick={() => statusesStore.delete(status.id)}></i>-->
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

            <label for="status_name">Nombre</label>
            <input type="text" id="status_name" bind:value={selected.name}>

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

    .x-item {
        cursor: pointer;
        border: none;
        background-color: transparent;
    }

    .x-id {
        color: #888;
        font-weight: 500;
        font-size: 15px;
    }

</style>
