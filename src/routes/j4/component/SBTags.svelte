<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { TagSchema, TagsSchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    type Props = {
        tags: TagsSchema;
    }

    let { tags = $bindable() }: Props = $props();

    let selected: TagSchema | undefined = $state();

    function handleSelectItem(tag: TagSchema) {
        selected = tag;
        console.debug('Selected tag -> ' + tag.id);
    }

    function test() {
        console.debug($state.snapshot(tags));
        console.debug($state.snapshot(tagsStore.tags));
    }
</script>

<h6>Tags</h6>
<button onclick={test}>Test</button>
<div>
    {#each Object.values(tags) as tag, i (tag.id)}
        <button class="x-item" onclick={() => handleSelectItem(tag)}>{tag.name}</button>
    {/each}
</div>

<br>

<div>
    {#if selected != null}
        <label for="tag_id">#</label>
        <input type="text" id="tag_id" bind:value={selected.id} readonly>

        <label for="tag_name">Nombre</label>
        <input type="text" id="tag_name" bind:value={selected.name}>
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
