<script lang="ts">
    import Button from '$lib/components/Button.svelte';
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

    <div class="x-bar">
        <Button icon="fas fa-fw fa-plus" onclick={add}>Nuevo</Button>
    </div>

    <ul class="x-list">
        {#each orderedStatuses as status, i (status.id)}
            <li class="x-list-item">
                <i class="fas fa-fw fa-2xs fa-percent"></i>
                <button class="x-item cursor-pointer"
                        title="Eliminar"
                        onclick={() => handleSelectItem(status)}>{status.name}</button>
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
    .x-bar {
        border-bottom: 1px solid rgba(#000, 0.2);
        padding: 2px;
        display: flex;
    }

    .x-list {
        background: #fff;
        height: 120px;
        overflow: auto;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid rgba(#000, 0.2);
    }
    .x-list-item {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;

        i {
            margin: 0 4px;
            opacity: 0.75;
            display: inline-block;
            flex: 0 0 auto;
        }
        button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            text-align: left;
            flex: 1 0 0;
        }
    }

    .x-id {
        color: #888;
        font-weight: 500;
        font-size: 15px;
    }

</style>
