<script lang="ts">
    import type { EntitySchema, EntityTypeSchema, EntityTypesSchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';

    type Props = {
        entityTypes: EntityTypesSchema;
    }

    let { entityTypes = $bindable() }: Props = $props();

    let selected: EntityTypeSchema | undefined = $state();

    function handleSelectItem(entityType: EntityTypeSchema) {
        selected = entityType;
        console.debug('Selected type -> ' + entityType.id);
    }

    function add() {
        const entityType: EntityTypeSchema = {
            id: "t" + nanoid(10),
            name: "Nuevo tipo de entidad",
            displayFn: "(raw) => '?' + raw.moduleId",
            parseFn: "(raw) => { return { }; }",
            lookupFn: "(str, raw) => 0"
        };
        entityTypes[entityType.id] = entityType;
        selected = entityTypes[entityType.id];
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="far fa-fw fa-cube"></i>
        Tipos de entidad
        <i class="fas fa-fw fa-caret-right"></i>
    </div>

    <button onclick={add}>+</button>
    <ul class="x-item-list">
        {#each Object.values(entityTypes) as entityType, i (entityType.id)}
            <button class="x-item" onclick={() => handleSelectItem(entityType)}>{entityType.name}</button>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="et_id">#</label>
            <input type="text" id="et_id" bind:value={selected.id} readonly disabled>

            <label for="et_name">Nombre</label>
            <input type="text" id="et_name" bind:value={selected.name}>

            <label for="et_displayfn">Display Function</label>
            <textarea id="et_displayfn" wrap="off" bind:value={selected.displayFn}></textarea>

            <label for="et_parsefn">Parse Function</label>
            <textarea id="et_parsefn" wrap="off" bind:value={selected.parseFn}></textarea>

            <label for="et_lookupfn">Lookup Function</label>
            <textarea id="et_lookupfn" wrap="off" bind:value={selected.lookupFn}></textarea>

            <label for="et_color">Color</label>
            <input type="text" id="et_color" bind:value={selected.color}>

            <label for="et_bgcolor">Color de fondo</label>
            <input type="text" id="et_bgcolor" bind:value={selected.bgColor}>
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

    textarea {
        overflow: auto;
    }

    .x-item {
        cursor: pointer;
        display: block;
        border: none;
        background-color: transparent;
    }

</style>
