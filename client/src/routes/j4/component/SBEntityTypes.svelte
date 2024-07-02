<script lang="ts">
    import type { EntityTypeSchema, EntityTypesSchema } from "$lib/types/j4_types";

    type Props = {
        entityTypes: EntityTypesSchema;
    }

    let { entityTypes = $bindable() }: Props = $props();

    let selected: EntityTypeSchema | undefined = $state();

    function handleSelectItem(entityType: EntityTypeSchema) {
        selected = entityType;
        console.debug('Selected type -> ' + entityType.id);
    }
</script>

<h6>Tipos de entidad</h6>

<div>
    {#each Object.values(entityTypes) as entityType, i (entityType.id)}
        <button class="x-item" onclick={() => handleSelectItem(entityType)}>{entityType.name}</button>
    {/each}
</div>

<br>

<div>
    {#if selected != null}
        <label for="et_name">Nombre</label>
        <input type="text" id="et_name" bind:value={selected.name}>

        <label for="et_displayfn">Display Function</label>
        <textarea id="et_displayfn" bind:value={selected.displayFn}></textarea>

        <label for="et_parsefn">Parse Function</label>
        <textarea id="et_parsefn" bind:value={selected.parseFn}></textarea>

        <label for="et_lookupfn">Lookup Function</label>
        <textarea id="et_lookupfn" bind:value={selected.lookupFn}></textarea>

        <label for="et_color">Color</label>
        <input type="text" id="et_color" bind:value={selected.color}>

        <label for="et_bgcolor">Color de fondo</label>
        <input type="text" id="et_bgcolor" bind:value={selected.bgColor}>
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
