<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { TagSchema, TagsSchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    let content = $state('');
    let domInput: HTMLTextAreaElement;

    $effect(() => {
        content = window.consoleBuffer;
        domInput.scrollTop = domInput.scrollHeight;
    });

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fas fa-fw fa-terminal"></i>
        Console output
    </div>

    <textarea class="x-textarea ff-mono" bind:value={content} readonly bind:this={domInput}></textarea>
</div>

<style lang="scss">
    .x-textarea {
        font-size: 9px;
        width: 100%;
        box-sizing: border-box;
        top: 0;
        bottom: 0;
        position: absolute;
    }
</style>
