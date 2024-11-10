<script lang="ts">
    import Codemirror from '$lib/components/Codemirror.svelte';
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

    let displayFnValid = $derived.by(() => {
        try {
            new Function(selected.displayFn);
            return true;
        } catch (e) {
            console.warn('Invalid display function', e);
            return false;
        }
    });
    let parseFnValid = $derived.by(() => {
        try {
            new Function(selected.parseFn);
            return true;
        } catch (e) {
            console.warn('Invalid parse function', e);
            return false;
        }
    });
    let lookupFnValid = $derived.by(() => {
        try {
            new Function(selected.lookupFn);
            return true;
        } catch (e) {
            console.warn('Invalid lookup function', e);
            return false;
        }
    });

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
                <button class="x-item" onclick={() => handleSelectItem(entityType)}>
                    <i class="fa-fw fa-xs {entityType?.icon}"></i>{entityType.name}
                </button>
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

            <label for="et_name">Nombre</label>
            <input type="text" id="et_name" bind:value={selected.name}>

            <label for="et_displayfn">Display Function</label>
            <div class="x-tx-wrapper" class:invalid={!displayFnValid}>
                <!--                <textarea id="et_displayfn" class="ff-mono" wrap="off" bind:value={selected.displayFn}></textarea>-->
                <Codemirror bind:value={selected.displayFn} height="80px" />
            </div>

            <label for="et_parsefn">Parse Function</label>
            <div class="x-tx-wrapper" class:invalid={!parseFnValid}>
                <!--                <textarea id="et_parsefn" class="ff-mono" wrap="off" bind:value={selected.parseFn}></textarea>-->
                <Codemirror bind:value={selected.parseFn} height="120px" />
            </div>

            <label for="et_lookupfn">Lookup Function</label>
            <div class="x-tx-wrapper" class:invalid={!lookupFnValid}>
                <!--                <textarea id="et_lookupfn" class="ff-mono" wrap="off" bind:value={selected.lookupFn}></textarea>-->
                <Codemirror bind:value={selected.lookupFn} height="120px" />
            </div>

            <!--            <label for="et_color">Color</label>-->
            <!--            <input type="text" id="et_color" bind:value={selected.color}>-->

            <!--            <label for="et_bgcolor">Color de fondo</label>-->
            <!--            <input type="text" id="et_bgcolor" bind:value={selected.bgColor}>-->

            <label for="et_icon">Icono</label>
            <input type="text" id="et_icon" placeholder="fax fa-xxx" bind:value={selected.icon}>

            <hr>

            <label for="et_raw">Exportar/Importar</label>
            <div class="x-tx-wrapper">
                <textarea id="et_raw" class="ff-mono" value={JSON.stringify(selected)}></textarea>
                <Codemirror value={JSON.stringify(selected)} height="120px" />
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

        &.invalid {
            box-shadow: 0 0 1px 2px #a00;
            border-color: transparent;
        }
    }


</style>
