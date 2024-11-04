<script lang="ts">
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntityTypeSchema, EntityTypesSchema } from '$lib/types/j4_types';
    import Button from '$lib/components/Button.svelte';

    type Props = {
        entityTypes: EntityTypesSchema;
    }

    let { entityTypes = $bindable() }: Props = $props();

    let view = $derived.by(() => {
        return Object.values(entityTypes).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    });

    let selected: EntityTypeSchema | undefined = $state();

    function handleSelectItem(entityType: EntityTypeSchema) {
        selected = entityType;
        console.debug('Selected type -> ' + entityType.id);
    }

    function add() {
        const id = prompt('Enter an ID for the new entity type');
        if (id == null) {
            return;
        }
        const entityType: EntityTypeSchema = entityTypesStore.add({
            id,
            name: 'Nuevo tipo de entidad',
            displayFn: '(id,raw) => \'?\' + raw.moduleId',
            parseFn: '(raw) => { return null; }',
            lookupFn: '(str, raw) => 0'
        });

        selected = entityType;
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-cube"></i>
        Tipos de entidad
    </div>

    <div class="x-bar">
        <Button icon="fas fa-fw fa-plus" onclick={add}>Nuevo</Button>
    </div>

    <ul class="x-list">
        {#each view as entityType, i (entityType.id)}
            <li class="x-list-item">
                <i class="fa-fw fa-2xs {entityType?.icon}"></i>
                <button class="x-item" onclick={() => handleSelectItem(entityType)}>{entityType.name}</button>
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="et_id">#</label>
            <input type="text" id="et_id" bind:value={selected.id} readonly disabled>

            <label for="et_name">Nombre</label>
            <input type="text" id="et_name" bind:value={selected.name}>

            <label for="et_displayfn">Display Function</label>
            <div class="x-tx-wrapper">
                <textarea id="et_displayfn" class="ff-mono" wrap="off" bind:value={selected.displayFn}></textarea>
            </div>

            <label for="et_parsefn">Parse Function</label>
            <div class="x-tx-wrapper">
                <textarea id="et_parsefn" class="ff-mono" wrap="off" bind:value={selected.parseFn}></textarea>
            </div>

            <label for="et_lookupfn">Lookup Function</label>
            <div class="x-tx-wrapper">
                <textarea id="et_lookupfn" class="ff-mono" wrap="off" bind:value={selected.lookupFn}></textarea>
            </div>

            <!--            <label for="et_color">Color</label>-->
            <!--            <input type="text" id="et_color" bind:value={selected.color}>-->

            <!--            <label for="et_bgcolor">Color de fondo</label>-->
            <!--            <input type="text" id="et_bgcolor" bind:value={selected.bgColor}>-->

            <label for="et_icon">Icono</label>
            <input type="text" id="et_icon" placeholder="fax fa-xxx" bind:value={selected.icon}>
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

    .x-tx-wrapper {
        textarea {
            box-sizing: border-box;
            width: 100%;
            height: 80px;
            font-size: 10px;
            resize: none;
        }
    }


</style>
