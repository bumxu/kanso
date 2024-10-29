<script lang="ts">
    import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte';
    import type { PrioritiesSchema, PrioritySchema } from '$lib/types/j4_types';

    type Props = {
        priorities: PrioritiesSchema;
    }

    let { priorities = $bindable() }: Props = $props();

    let orderedPriorities: PrioritySchema[] = $derived.by(() => {
        return Object.values(priorities).sort((a, b) => a.name.localeCompare(b.name));
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

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fas fa-fw fa-fire"></i>
        Priorities
        <i class="fas fa-fw fa-caret-right"></i>
    </div>

    <button onclick={add}>+</button>
    <ul class="x-item-list">
        {#each orderedPriorities as priority, i (priority.id)}
            <li>
                <button class="x-item" onclick={() => handleSelectItem(priority)}>{priority.name}</button>
                <!--                <i class="fas fa-sm fa-fw fa-trash" onclick={() => prioritiesStore.delete(priority.id)}></i>-->
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="priority_id">#</label>
            <input type="text" id="priority_id" bind:value={selected.id} readonly disabled>

            <label for="priority_name">Nombre</label>
            <input type="text" id="priority_name" bind:value={selected.name}>
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
