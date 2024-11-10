<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Codemirror from '$lib/components/Codemirror.svelte';
    import Ic from '$lib/components/Ic.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte.js';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitiesSchema, EntitySchema, EntityTypeSchema, ETypeDisplayFn } from '$lib/types/j4_types';

    type Props = {
        entities: EntitiesSchema;
    }

    let { entities = $bindable() }: Props = $props();

    let view = $derived.by(() => {
        return Object.values(entities).sort((a, b) => {
            if (a.type === b.type) {
                const adp = display(a);
                const bdp = display(b);
                return adp.localeCompare(bdp);
            }
            return a.type != null ? a.type.localeCompare(b.type) : 1;
        });
    });

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
        handleSelectItem(entity);
    }

    function display(entity: EntitySchema) {
        return entityTypesStore.getDisplayFn(entity.type)(entity.id, entity.raw);
    }

    function getIcon(typeId: string) {
        const entityType = entityTypesStore.get(typeId);
        return entityType?.icon;
    }

    function handleClickDelete(id: string, ev?: MouseEvent) {
        if (ev) ev.stopPropagation();
        entitiesStore.delete(id);
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-cubes-stacked"></i>
        Entidades
    </div>

    <div class="x-bar">
        <Button icon="fas fa-fw fa-plus" onclick={add}>Nuevo</Button>
    </div>

    <ul class="x-list">
        {#each view as entity, i (entity.id)}
            <li class="x-list-item">
                <button class="x-item" onclick={() => handleSelectItem(entity)}>
                    <i class="fa-fw fa-xs {getIcon(entity.type)}"></i>{display(entity)}
                </button>
                <Ic iconclass="far fa-fw fa-sm fa-trash" label="Eliminar"
                    onclick={ev=>handleClickDelete(entity.id, ev)} />
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

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
            <div class="x-tx-wrapper">
                <!--                <textarea id="tag_data" class="ff-mono" bind:value={selectedRawJSON} oninput={handleRawChange}></textarea>-->
                <Codemirror bind:value={selectedRawJSON} oninput={handleRawChange} />
            </div>
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

    .x-tx-wrapper {
        border: 1px solid rgba(#000, 0.2);
        border-radius: 1px;
        overflow: hidden;

        //textarea {
        //    box-sizing: border-box;
        //    width: 100%;
        //    height: 60px;
        //    font-size: 10px;
        //    resize: none;
        //}
    }

</style>
