<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
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
        <i class="fas fa-fw fa-tag"></i>
        Tags
        <i class="fas fa-fw fa-caret-right"></i>
    </div>

    <ul class="x-item-list">
        {#each orderedTags as tag, i (tag.id)}
            <li>
                <button class="x-item" onclick={() => handleSelectItem(tag)}>{tag.name}</button>
                <i class="fas fa-sm fa-fw fa-trash" onclick={() => tagsStore.delete(tag.id)}></i>
            </li>
        {/each}
    </ul>

    <div class="x-form">
        {#if selected != null}
            <label for="tag_id">#</label>
            <input type="text" id="tag_id" bind:value={selected.id} readonly disabled>

            <label for="tag_name">Nombre</label>
            <input type="text" id="tag_name" bind:value={selected.name}>
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
        border: none;
        background-color: transparent;
    }



</style>
