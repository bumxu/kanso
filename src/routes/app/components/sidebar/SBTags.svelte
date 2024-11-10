<script lang="ts">
    import Ic from '$lib/components/Ic.svelte';
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
                <button onclick={() => handleSelectItem(tag)}>
                    <i class="fad fa-fw fa-2xs fa-tag"></i>{tag.name}
                </button>
                <Ic iconclass="far fa-fw fa-sm fa-trash"
                    label="Eliminar"
                    onclick={() => tagsStore.delete(tag.id)} />
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <div class="x-id ff-mono">#{selected.id}</div>

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
    .x-bar {
        border-bottom: 1px solid rgba(#000, 0.2);
        padding: 2px;
        display: flex;
    }
</style>
