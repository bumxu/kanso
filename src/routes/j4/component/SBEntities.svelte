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
        const entity:EntitySchema = {
            id: nanoid(10),
            type: "?"
        };
        entities[entity.id] = entity;
        selected = entities[entity.id];
    }
</script>

<h6>Entidades</h6>
<button onclick={add}>+</button>
<div>
    {#each Object.values(entities) as entity, i (entity.id)}
        <button class="x-item" onclick={() => handleSelectItem(entity)}>#{entity.id}</button>
    {/each}
</div>

<br>

<div>
    {#if selected != null}
        <label for="tag_id">#</label>
        <input type="text" id="tag_id" bind:value={selected.id} readonly>

        <label for="type_name">Nombre</label>
        <input type="text" id="type_name" bind:value={selected.type}>

        <textarea bind:value={selectedRawJSON}></textarea>
    {:else}
        -- selecciones un elemento para editar --
    {/if}
</div>

<style lang="scss">

    .x-item {
        cursor: pointer;
        display: block;
        border: none;
        background-color: transparent;
    }

</style>
