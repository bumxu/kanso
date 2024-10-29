<script lang="ts">
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte';
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
        const status: StatusSchema = {
            id: '',
            name: 'Nuevo estado'
        };
        statusesStore.add(status);
    }

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fas fa-fw fa-percent"></i>
        Statuses
        <i class="fas fa-fw fa-caret-right"></i>
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
            <label for="status_id">#</label>
            <input type="text" id="status_id" bind:value={selected.id} readonly disabled>

            <label for="status_name">Nombre</label>
            <input type="text" id="status_name" bind:value={selected.name}>
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


</style>
