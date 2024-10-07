<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { EntitiesSchema, EntitySchema, EntryEntitySchema, SuggestionsSchema, TagSchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';

    let { entryId, entities = $bindable() }: { entryId: number, entities: EntryEntitySchema[] } = $props();

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    let entityInput = $state('');
    let entityMatches: SuggestionsSchema<EntitySchema> = $state([]);
    let entityMatchesVisible = $state(false);
    let entityMatchesSelectedIndex = $state(-1);

    let entitiesRaw = $state(JSON.stringify(entities));

    function add() {
        //entities.push({entity: null});
    }

    function handleFocus() {
        focused = true;
        if (entityInput.length > 0) {
            entityMatchesVisible = true;
        }
    }

    function handleBlur() {
        focused = false;
        entityMatchesVisible = false;
    }

    async function handleInput(e: any) {
        const term = e.target.innerText;
        if (term.length > 0) {
            entityMatches = entitiesStore.getSuggestions(term);
            console.debug(entityMatches);

            if (entityMatches.length > 0) {
                entityMatchesSelectedIndex = 0;
            } else {
                entityMatchesSelectedIndex = -1;
            }

            entityMatchesVisible = true;
        } else {
            entityMatches = [];
            entityMatchesVisible = false;
        }
    }

    function applyRaw() {
        try {
            console.log('parseando -> ', entitiesRaw);
            entities = JSON.parse(entitiesRaw);
        } catch (e) {
            alert('Nope');
            console.error(e);
        }
    }

    function display(item: EntitySchema): string {
        const type = entityTypesStore.entityTypes[item.type];
        const displayFn = new Function('return ' + type.displayFn)();
        return displayFn(item.raw);
    }

</script>

<div class="x-cell x-cell-wrapper">
    <div>
        <textarea bind:value={entitiesRaw} style="border:1px solid red; height: 20px" onchange={applyRaw}></textarea>
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
          oninput={handleInput}
          onfocus={handleFocus}
          onblur={handleBlur}
    ></span>

    {#if entityMatchesVisible}
        <div class="x-tag-matches">
            <span class="x-tag-match"
                  class:selected={entityMatchesSelectedIndex === -1}>
                {entityInput} (nueva)
            </span>
            {#each entityMatches as entityMatch, i}
                <span class="x-tag-match"
                      class:selected={entityMatchesSelectedIndex === i}
                >{display(entityMatch.item)}</span>
            {/each}
        </div>
    {/if}

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

    .x-entity.x-new {
        display: block;
        float: left;
        padding: 0 2px;
        border-radius: 2px;
        background: #ddd;
        margin-right: 2px;
        margin-bottom: 2px;
        font-size: 0.6rem;
        font-weight: 700;
        text-rendering: optimizeLegibility;
        color: #555;
        border: 1px solid #ccc;

        &.x-new {
            background-color: #ffffD6;
            outline: none;
            white-space: nowrap;
        }
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