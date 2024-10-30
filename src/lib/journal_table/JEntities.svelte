<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitySchema, EntryEntitySchema, SuggestionsSchema } from '$lib/types/j4_types';
    import type { Nil } from '$lib/types/j4_types.js';
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
        const term = e.target.value;
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

    function handleUnlink(entity: EntitySchema) {
        console.log('Unlinking entity -> ', entity);
        entities = entities.filter(e => e.id !== entity.id);
    }

    function display(item: EntitySchema): string {
        const displayFn = entityTypesStore.getDisplayFn(item.type);
        return displayFn(item.id, item.raw);
    }

    function typeIcon(item: EntitySchema): Nil<string> {
        const type = entityTypesStore.get(item.type);
        return type?.icon;
    }

</script>

<div class="x-cell x-cell-wrapper">

    <div class="x-entities">
        {#each entities as entity}
            <JEntryEntity entryId={entryId} linkedEntity={entity} onUnlinkEntity={()=>handleUnlink(entity)} />
        {/each}
    </div>

    <input type="text" class="x-entity x-new"
           placeholder="· ·"
           bind:value={entityInput}
           bind:this={domInput}
           oninput={handleInput}
           onfocus={handleFocus}
           onblur={handleBlur}
           onkeydown={handleKeyDown} />

    {#if entityMatchesVisible}
        <div class="x-entity-matches">
            <span class="x-entity-match"
                  class:selected={entityMatchesSelectedIndex === -1}>
                {entityInput} (nueva)
            </span>
            {#each entityMatches as entityMatch, i}
                <span class="x-match"
                      class:selected={entityMatchesSelectedIndex === i}>
                    <i class="fa-fw fa-xs {typeIcon(entityMatch.item)}"></i>
                    <span class="x-label">{display(entityMatch.item)}</span>
                </span>
            {/each}
        </div>
    {/if}

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
        overflow: auto;
    }

    .x-entity.x-new {
        display: block;
        background-color: transparent;
        text-rendering: optimizeLegibility;
        border: 0; //1px solid #ccc;
        font-size: 11px;
        padding: 0 4px;
        outline: none;

        &:hover, &:focus {
            background-color: #ffffD6;
        }

        &:empty:not(:focus) {
            font-size: 6px;
        }
    }

    .x-entity-matches {
        position: absolute;
        background: white;
        border-radius: 1px;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
        z-index: 100;
        top: 100%;
        min-width: calc(100% - 2px);
        max-width: 120%;

        .x-match {
            display: flex;
            padding: 1px 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            align-items: center;

            i {
                opacity: 0.75;
                margin-right: 4px;
                flex: 0 0 auto;
            }
            .x-label {
                flex: 1 0 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            &.selected {
                background: rgba(0, 0, 0, 0.04);
                color: #000;
            }
            &:hover {
                background: rgba(0, 0, 0, 0.08);
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