<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Ic from '$lib/components/Ic.svelte';
    import { includes } from '$lib/helpers/runtime.helper.js';
    import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte.js';
    import type { PrioritiesSchema, PrioritySchema } from '$lib/types/j4_types';

    type Props = {
        priorities: PrioritiesSchema;
    }

    let { priorities = $bindable() }: Props = $props();

    let filterValue = $state('');
    let view: PrioritySchema[] = $derived.by(() => {
        const sorted = Object.values(priorities).sort((a, b) => a.name.localeCompare(b.name));
        const filtered = sorted.filter((priority) => includes(priority.name, filterValue));
        return filtered;
    });

    let selected: PrioritySchema | undefined = $state();

    function handleSelectItem(priority: PrioritySchema) {
        selected = priority;
        console.debug('Selected priority -> ' + priority.id);
    }

    function add() {
        const priority: PrioritySchema = {
            id: '',
            name: 'Nueva prioridad'
        };
        prioritiesStore.add(priority);
    }

    function handleClearFilter() {
        filterValue = '';
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-fire"></i>
        Prioridades
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
        {#each view as priority, i (priority.id)}
            <li class="x-list-item">
                <button onclick={() => handleSelectItem(priority)}>
                    <i class="fas fa-fw fa-2xs fa-fire"></i>{priority.name}
                </button>
                <!--                <i class="fas fa-sm fa-fw fa-trash" onclick={() => prioritiesStore.delete(priority.id)}></i>-->
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

            <label for="priority_name">Nombre</label>
            <input type="text" id="priority_name" class="txinp" bind:value={selected.name}>
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
