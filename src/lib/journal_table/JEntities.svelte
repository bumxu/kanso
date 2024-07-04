<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
  import type { EntitiesSchema, EntryEntitySchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    let { entryId, entities = $bindable() }: {entryId:number,entities:EntryEntitySchema[]} = $props();

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    let entitiesRaw = $state(JSON.stringify(entities));

    function add() {
        //entities.push({entity: null});
    }

    function applyRaw() {
        try {
            console.log("parseando -> ", entitiesRaw);
            entities = JSON.parse(entitiesRaw);
        } catch(e) {
            alert('Nope');
            console.error(e);
        }
    }

</script>

<div class="x-cell-wrapper">
    <div>
        <textarea bind:value={entitiesRaw} style="border:1px solid red" onchange={applyRaw}></textarea>
    </div>
    <div class="x-entities">
        {#each entities as entity}
            <!--    &lt;!&ndash;    <div>{entity.entity.extId}</div>&ndash;&gt;-->
            <JEntryEntity entryId={entryId} linkedEntity={entity} />
        {/each}
    </div>
    <span class="x-entity x-new"
        role="textbox"
        contenteditable="true"
        tabindex="0"
        bind:this={domInput}
    ></span>
    <!--
        class:hidden={!focused && tagInput.length === 0}
    bind:textContent={tagInput}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    onkeydown={handleKeyDown}
-->
    <button onclick={add}>
        <i class="fas fa-caret-down fa-sm"></i>
    </button>
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .x-entities {
        flex-grow: 1;
    }

    button {
        display: block;
        position: relative;
        width: 100%;
        height: 10px;
        padding: 0;
        line-height: 10px;
        border: none;
        cursor: pointer;
    }
</style>