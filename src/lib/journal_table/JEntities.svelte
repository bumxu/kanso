<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitySchema, EntryEntitySchema, SuggestionsSchema } from '$lib/types/j4_types';
    import { nanoid } from 'nanoid';

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

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('a');
            if (entityInput.length > 0) {
                console.log('b');
                let entity: EntitySchema;
                if (entityMatchesSelectedIndex === -1) {
                    //         entity = entitiesStore.add({ name: entityInput });
                    return;
                } else {
                    entity = entityMatches[entityMatchesSelectedIndex].item;
                }
                link(entity);
                //     tagInput = '';
                //     //domInput.blur();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            entityMatchesSelectedIndex = Math.min(entityMatchesSelectedIndex + 1, entityMatches.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            entityMatchesSelectedIndex = Math.max(entityMatchesSelectedIndex - 1, -1);
        } else if (e.key === 'Escape') {
            domInput.blur();
        }
    }

    function link(entity: EntitySchema) {
        const type = entityTypesStore.entityTypes[entity.type];
        const displayFn = entityTypesStore.getDisplayFn(type.id);
        const name = displayFn ? displayFn(entity.raw) : '?';

        console.log('Linking entity -> ', entity);
        // if (!tagsIds.includes(tag.id)) {
        console.debug(`Entity ${entity.id} "${name}" añadida al registro`);
        //     tagsIds.push(tag.id);
        entities.push({
            id: nanoid(10),
            entityId: entity.id,
            metadata: {}
        });
        //     tagMatchesVisible = true;
        // }
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
        const displayFn = entityTypesStore.getDisplayFn(item.type);
        return displayFn(item.id, item.raw);
    }

</script>

<div class="x-cell x-cell-wrapper">
<!--    <div>-->
<!--        <textarea bind:value={entitiesRaw} style="border:1px solid red; height: 20px" onchange={applyRaw}></textarea>-->
<!--    </div>-->
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
          bind:textContent={entityInput}
          oninput={handleInput}
          onfocus={handleFocus}
          onblur={handleBlur}
          onkeydown={handleKeyDown}
    ></span>

    {#if entityMatchesVisible}
        <div class="x-entity-matches">
            <span class="x-entity-match"
                  class:selected={entityMatchesSelectedIndex === -1}>
                {entityInput} (nueva)
            </span>
            {#each entityMatches as entityMatch, i}
                <span class="x-entity-match"
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
<!--    <button onclick={add}>-->
<!--        <i class="fas fa-caret-down fa-sm"></i>-->
<!--    </button>-->
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

    .x-entity-matches {
        position: absolute;
        background: white;
        border-radius: 2px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        z-index: 100;
        min-width: calc(100% - 4px);

        .x-entity-match {
            display: block;
            padding: 2px 4px;
            cursor: pointer;
            font-weight: 600;

            &:hover, &.selected {
                background: rgba(0, 0, 0, 0.04);
                color: #000;
            }
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