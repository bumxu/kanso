<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte.js';
    import type { TagSchema, TagsSchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    type Props = {
        tags: TagsSchema;
    }

    let { tags = $bindable() }: Props = $props();

    let orderedTags: TagSchema[] = $derived.by(() => {
        return Object.values(tags).sort((a, b) => a.name.localeCompare(b.name));
    });

    let selected: TagSchema | undefined = $state();

    function handleSelectItem(tag: TagSchema) {
        selected = tag;
        console.debug('Selected tag -> ' + tag.id);
    }

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-tag"></i>
        Etiquetas
    </div>

    <ul class="x-list">
        {#each orderedTags as tag, i (tag.id)}
            <li class="x-list-item">
                <i class="fad fa-fw fa-2xs fa-tag"></i>
                <button onclick={() => handleSelectItem(tag)}>{tag.name}</button>
                <i class="far fa-xs fa-fw fa-trash cursor-pointer"
                   title="Eliminar"
                   onclick={() => tagsStore.delete(tag.id)}></i>
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="tag_id">#</label>
            <input type="text" id="tag_id" bind:value={selected.id} readonly disabled>

            <label for="tag_name">Nombre</label>
            <input type="text" id="tag_name" bind:value={selected.name}>

            <label for="tag_bgColor">Color</label>
            <input type="color" id="tag_bgColor" bind:value={selected.bgColor}>
            <button onclick={() => selected.bgColor = ''}>Quitar</button>

            <label for="tag_color">Color de texto</label>
            <input type="color" id="tag_color" bind:value={selected.color}>
            <button onclick={() => selected.color = ''}>Quitar</button>
        {:else}
            <div class="x-no-selection">
                <i class="fas fa-fw fa-hand-back-point-up"></i> Seleccione un elemento para editar
            </div>
        {/if}
    </div>
</div>

<style lang="scss">

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


</style>
