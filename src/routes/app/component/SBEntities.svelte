<script lang="ts">
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
    import type { EntitiesSchema, EntitySchema, EntityTypeSchema, ETypeDisplayFn } from '$lib/types/j4_types';

    type Props = {
        entities: EntitiesSchema;
    }

    let { entities = $bindable() }: Props = $props();

    let selected: EntitySchema | null = $state(null);
    let selectedRawJSON = $state('');
    let selectedType: EntityTypeSchema | null = $derived.by(() => {
        return selected?.type ? entityTypesStore.get(selected.type) : null;
    });

    function handleSelectItem(entity: EntitySchema) {
        selected = entity;
        selectedRawJSON = entity?.raw ? JSON.stringify(entity.raw) : '';
        console.debug('Selected entity -> ' + entity.id);
    }

    function handleRawChange() {
        if (selected != null) {
            try {
                selected.raw = JSON.parse(selectedRawJSON);
            } catch (e) {
                console.error('Error al parsear JSON', e);
            }
        }
    }

    function add() {
        const entity: EntitySchema = entitiesStore.add({
            id: undefined,
            type: undefined,
            raw: {}
        });
        selected = entity;
    }

    function display(entity: EntitySchema) {
        const displayFn: ETypeDisplayFn | null = entityTypesStore.getDisplayFn(entity.type);
        if (displayFn != null) {
            return displayFn(entity.id, entity!.raw);
        }
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fas fa-fw fa-cubes-stacked"></i>
        Entidades
        <i class="fas fa-fw fa-caret-right"></i>
    </div>

    <button onclick={add}>+</button>
    <ul class="x-item-list">
        {#each Object.values(entities) as entity, i (entity.id)}
            <button class="x-item" onclick={() => handleSelectItem(entity)}>{display(entity)}</button>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="tag_id">#</label>
            <input type="text" id="tag_id" bind:value={selected.id} readonly disabled>

            <label for="type_name">Tipo</label>
            <select bind:value={selected.type} style="width: 95%">
                <option value={undefined}>(Tipo no seleccionado)</option>
                {#each Object.values(entityTypesStore.entityTypes) as etype, i (etype.id)}
                    <option value={etype.id}>{etype.name}</option>
                {/each}
            </select>
            {#if selected.type != null && selectedType == null}
                <input type="text" id="type_name" bind:value={selected.type}>
            {/if}

            <label for="tag_data">Raw data</label>
            <textarea id="tag_data" bind:value={selectedRawJSON} oninput={handleRawChange}></textarea>
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
        display: block;
        border: none;
        font-size: 12px;
        background-color: transparent;
        text-align: left;
    }

</style>
