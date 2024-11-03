<script lang="ts">
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte.js';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitySchema, EntryEntitySchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';
    import type { EventHandler } from 'svelte/elements';
    import { slide } from 'svelte/transition';
    import { appStore } from '../../appstate.store.svelte';

    let {
        linkedEntity,
        onUnlinkEntity
    }: {
        linkedEntity: EntryEntitySchema,
        onUnlinkEntity: EventHandler
    } = $props();

    //export let entryId: number;
    //export let linkedEntity: any;
    const entitySnapshot: EntryEntitySchema | undefined = $state();

    //let isNew: boolean;
    //let dirty: boolean = false;

    let entity: EntitySchema | null = $derived.by(() => {
        if (linkedEntity == null) {
            console.debug('entity -> linkedEntity is null');
            return null;
        }
        // console.debug('linkedEntity', linkedEntity);
        // console.debug('entity ->', entitiesStore.entities[linkedEntity.entityId]);
        return entitiesStore.entities[linkedEntity.entityId];
    });
    let entityType = $derived.by(() => {
        if (entity == null) {
            console.debug('entityType -> entity is null');
            return null;
        }
        //console.debug('entityType ->', entityTypesStore.entityTypes[entity.type]);
        return entityTypesStore.entityTypes[entity.type];
    });
    let entityDisplay = $derived.by(() => {
        if (entity == null || entityType == null) {
            //console.debug('entityDisplay -> entity or entityType is null');
            return '';
        }
        // console.debug('entityDisplay ->', entityType.displayFn);
        const displayFn = entityTypesStore.getDisplayFn(entityType);
        return displayFn(entity.id, entity.raw);
    });

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    // Texto introducido por el usuario
    let userInput = $state('');
    // Entidades que coinciden con la entidad introducida por el usuario
    let matches: any[] = $state([]);
    // Si se muestra el dropdown con las entidades sugeridas
    let matchesVisible = $state(false);
    // Índice de la entidad seleccionada en el dropdown
    let matchesSelectedIndex = $state(-1);

    let userInputEntity = '';
    //entityFromInput(userInput);

    onMount(() => {
        // dirty = linkedEntity.entity == null;
        // userInput = linkedEntity.entity != null ? entityToStr(linkedEntity) : '';
    });

    export function focus() {
        domInput.focus();
    }

    function handleFocus() {
        focused = true;
        if (userInput.length > 0) {
            matchesVisible = true;
        }
    }

    function handleBlur() {
        focused = false;
        matchesVisible = false;
    }

    async function handleInput(event: any) {
        if (userInput.length > 0 && userInputEntity != null) {
            console.debug('handleInput -> "' + userInput + '"');
            const inputEntity = entityFromInput(userInput);
            matches = entitiesStore.getSuggestions(userInput);
            if (matches.length > 0) {
                matchesSelectedIndex = 0;
            } else {
                matchesSelectedIndex = -1;
            }
            matchesVisible = true;
        } else {
            matchesVisible = false;
        }
    }

    async function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // if (tagInput.length > 0) {
            //     if (matchesSelectedIndex === -1) {
            //         const tag = await create(tagInput);
            //         if (tag)
            //             await link(tag);
            //     } else {
            //         const tag = tagMatches[matchesSelectedIndex];
            //         await link(tag);
            //     }
            //     tagInput = '';
            //     domInput.blur();
            // }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            matchesSelectedIndex = Math.min(matchesSelectedIndex + 1, matches.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            matchesSelectedIndex = Math.max(matchesSelectedIndex - 1, -1);
        } else if (e.key === 'Escape') {
            domInput.blur();
        }
    }

    function entityToStr(entityLnk: any) {
        let str = '';
        const lnkMetadata = JSON.parse(entityLnk.metadata);

        if (lnkMetadata.prefix != null) {
            str += lnkMetadata.prefix + ' ';
        }

        str += entityLnk.entity.extId;

        if (lnkMetadata.suffix != null) {
            str += ' ' + lnkMetadata.suffix;
        }

        return str;
    }

    function strToEntity(str: string) {
        str = str.trim();

        if (/^[TMC]\d{3,8}/.test(str)) {
            // Egipto

        } else if (/^R \d+/.test(str)) {
            // Remedy

        } else if (/^T \d+/.test(str)) {

        } else if (/^O \d+/.test(str)) {

        } else {
            return { entity: str };
        }
    }

    function entityFromInput(input: string) {
        const splt = input.trim().split(/\s+/);
        if (splt.length == 1) {
            return splt[0];
        } else if (splt.length >= 2) {
            return splt[1];
        } else {
            return null;
        }
    }

    function handleClickEdit() {
        console.debug('handleClickEdit');
    }

</script>

<div class="x-entity" transition:slide={{duration: 120}}>
    <div class="x-label" title="{entityDisplay} [#{entity.id}]">
        {#if entityType?.icon}
            <i class="fa-fw fa-xs {entityType?.icon}"></i>
        {/if}
        {entityDisplay ? entityDisplay : '?'}
    </div>
    {#if appStore.ctrlKeyPressed}
        <div class="x-side">
            <!--            <button class="fas fa-fw fa-sm fa-filter"-->
            <!--                    aria-label="Filtrar" title="Filtrar"-->
            <!--                    onclick={handleClickEdit}></button>-->
            <!--            <button class="fas fa-fw fa-sm fa-pen"-->
            <!--                    aria-label="Editar" title="Editar"-->
            <!--                    onclick={handleClickEdit}></button>-->
            <button class="far fa-fw fa-sm fa-trash" style="color: #aaa"
                    aria-label="Quitar" title="Quitar"
                    onclick={(ev) => {ev.stopPropagation();ev.preventDefault();onUnlinkEntity();}}></button>
        </div>
    {/if}
</div>

<style lang="scss">
    .x-entity {
        font-size: 11px;
        padding: 0 4px;
        border-bottom: 1px dotted var(--table-sep-color);
        display: flex;
    }
    .x-label {
        flex: 1 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        i {
            //margin-right: 2px;
            opacity: 0.75;
        }
    }
    .x-side {
        flex: 0 0 auto;
    }

    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }
</style>