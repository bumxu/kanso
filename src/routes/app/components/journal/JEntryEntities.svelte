<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte.js';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitySchema, EntryEntitySchema, SuggestionsSchema } from '$lib/types/j4_types';
    import type { Nil } from '$lib/types/j4_types.js';
    import { nanoid } from 'nanoid';
    import { tick } from 'svelte';
    import JEntryEntity from './JEntryEntity.svelte';

    type Props = {
        entryId: number;
        entities: EntryEntitySchema[];
    }
    let { entryId, entities = $bindable() }: Props = $props();

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    let entityInput = $state('');
    let entityMatches: SuggestionsSchema<EntitySchema> = $state([]);
    let entityMatchesSelectedIndex = $state(-1);

    let entitiesRaw = $state(JSON.stringify(entities));

    let entityMatchesVisible = $derived.by(() => focused && entityMatches.length > 0);

    let itemToFocusOnMount: string | null = null;

    function handleFocus() {
        focused = true;
    }
    function handleBlur() {
        focused = false;
    }

    async function handleInput(e: GenericInputEvent) {
        let matches: SuggestionsSchema<EntitySchema> = [];
        const term = e.currentTarget.value;
        if (term.length > 0) {
            matches = entitiesStore.getSuggestions(term);
            console.debug(matches);

            if (matches.length > 0) {
                entityMatchesSelectedIndex = 0;
            } else {
                entityMatchesSelectedIndex = -1;
            }
        }
        entityMatches = matches;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (entityInput.length > 0) {
                let entity: EntitySchema;
                const entityMatchesSelected = entityMatches[entityMatchesSelectedIndex];
                if (entityMatchesSelected.weight < 0) {
                    const entitySkel = entityMatchesSelected.item;
                    entity = entitiesStore.add(entitySkel);
                } else {
                    entity = entityMatchesSelected.item;
                    console.debug('eh', entityMatches, entityMatchesSelectedIndex, entity);
                }
                link(entity);
                entityMatches = [];
                entityInput = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (entityInput.length > 0) {
                let entity: EntitySchema;
                const entityMatchesSelected = entityMatches[entityMatchesSelectedIndex];
                if (entityMatchesSelected.weight < 0) {
                    const entitySkel = entityMatchesSelected.item;
                    entity = entitiesStore.add(entitySkel);
                } else {
                    entity = entityMatchesSelected.item;
                    console.debug('eh', entityMatches, entityMatchesSelectedIndex, entity);
                }
                const entryEntityId = link(entity);
                entityMatches = [];
                entityInput = '';
                // Focus note
                itemToFocusOnMount = entryEntityId;
                tick().then(() => itemToFocusOnMount = null);
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
        const name = displayFn ? displayFn(entity.id, entity.raw) : '?';

        console.log('Linking entity -> ', entity);
        // if (!tagsIds.includes(tag.id)) {
        console.debug(`Entity ${entity.id} "${name}" añadida al registro`);
        //     tagsIds.push(tag.id);

        const id = nanoid(10);
        entities.push({
            id: id,
            entityId: entity.id
        });
        //     tagMatchesVisible = true;
        // }
        return id;
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

    function handleCellClick(ev: MouseEvent) {
        domInput.focus();
    }

</script>

<div class="x-cell-content" role="none" onclick={handleCellClick}>

    <SimpleBar>
        <div class="x-entities">
            {#each entities as entity}
                <JEntryEntity entryId={entryId} linkedEntity={entity} onUnlinkEntity={()=>handleUnlink(entity)} focusNoteOnMount={itemToFocusOnMount === entity.id} />
            {/each}
            <input type="text" class="x-entity x-new"
                   bind:value={entityInput}
                   bind:this={domInput}
                   oninput={handleInput}
                   onfocus={handleFocus}
                   onblur={handleBlur}
                   onkeydown={handleKeyDown} />
        </div>
    </SimpleBar>

    {#if entityMatchesVisible}
        <div class="x-entity-matches">
            {#each entityMatches as entityMatch, i}
                <span class="x-match" class:x-new={entityMatch.weight < 0}
                      class:selected={entityMatchesSelectedIndex === i}>
                    <i class="fa-fw fa-xs {typeIcon(entityMatch.item)}"></i>
                    <span class="x-label">{entityMatch.displayName}</span>
                </span>
            {/each}
        </div>
    {/if}

</div>

<style lang="scss">
    .x-cell-content {
        cursor: text;
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        width: 100%;

        &:hover {
            background-color: var(--color-hovered);
        }
    }

    .x-entity.x-new {
        display: block;
        background-color: transparent;
        text-rendering: optimizeLegibility;
        border: 0;
        font-size: 11px;
        padding: 0 4px;
        outline: none;
        width: 100%;
        border-bottom: 1px dotted var(--table-sep-color);
        transition: background-color 0.2s;

        &:focus {
            background-color: var(--color-focused);
        }

        &:empty:not(:focus) {
            height: 0;
            border: 0;
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
        max-height: 125px;
        overflow: auto;

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

            &.x-new {
                //background: rgb(221, 246, 207);
                color: #217323;
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