<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { EntitiesSchema, EntitySchema, EntrySchema, TagSchema, TagsSchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';
    import { onMount } from 'svelte';

    type Props = {
        entities: EntitiesSchema;
    }

    let { entities = $bindable() }: Props = $props();

    let selected: EntitySchema | undefined = $state();
    let selectedRawJSON = $state('');

    function handleSelectItem(entity: EntitySchema) {
        selected = entity;
        selectedRawJSON = entity?.raw ? JSON.stringify(entity.raw) : '';
        console.debug('Selected entity -> ' + entity.id);
    }

    function add() {
        const entity: EntitySchema = {
            id: nanoid(10),
            type: '?'
        };
        entities[entity.id] = entity;
        selected = entities[entity.id];
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
            <button class="x-item" onclick={() => handleSelectItem(entity)}>#{entity.id}</button>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="tag_id">#</label>
            <input type="text" id="tag_id" bind:value={selected.id} readonly disabled>

            <label for="type_name">Tipo</label>
            <input type="text" id="type_name" bind:value={selected.type}>

            <label for="tag_data">Raw data</label>
            <textarea id="tag_data" bind:value={selectedRawJSON}></textarea>
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
        background-color: transparent;
    }

</style>
