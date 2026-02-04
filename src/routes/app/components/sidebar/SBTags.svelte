<script lang="ts">
    import Ic from '$lib/components/Ic.svelte';
    import { includes } from '$lib/helpers/runtime.helper.js';
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte.js';
    import type { TagSchema, TagsSchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    type Props = {
        tags: TagsSchema;
    }

    let { tags = $bindable() }: Props = $props();

    let filterValue = $state('');
    let view: TagSchema[] = $derived.by(() => {
        const sorted = Object.values(tags).sort((a, b) => a.name.localeCompare(b.name));
        const filtered = sorted.filter((tag) => includes(tag.name, filterValue));
        return filtered;
    });

    let selected: TagSchema | undefined = $state();

    function handleSelectItem(tag: TagSchema) {
        selected = tag;
        console.debug('Selected tag -> ' + tag.id);
    }

    function handleClearFilter() {
        filterValue = '';
    }
</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-tag"></i>
        Etiquetas
    </div>

    <div class="x-bar">
        <!--        <button onclick={tagsStore.add}>-->
        <!--            <i class="fad fa-fw fa-plus"></i> Nueva-->
        <!--        </button>-->
        <div class="flex-1"></div>
        <input class="txinp x-search" type="text" placeholder="Filtrar..." bind:value={filterValue} />
        <Ic iconclass="fad fa-sm fa-delete-left ms-4 me-2"
            label="Limpiar"
            onclick={handleClearFilter} />
    </div>

    <ul class="x-list">
        {#each view as tag, i (tag.id)}
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
            <input type="text" id="tag_name" class="txinp" bind:value={selected.name}>

            <label for="priority">Prioridad</label>
            <input type="number" id="priority" class="txinp" bind:value={selected.priority}>

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

        .x-search {
            width: 180px;
        }
    }
</style>
