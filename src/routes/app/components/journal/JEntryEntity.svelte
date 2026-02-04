<script lang="ts">
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte.js';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte.js';
    import type { EntitySchema, EntryEntitySchema } from '$lib/types/j4_types';
    import { onMount, tick } from 'svelte';
    import type { EventHandler } from 'svelte/elements';
    import { slide } from 'svelte/transition';
    import { appStore } from '../../appstate.store.svelte';

    type Props = {
        linkedEntity: EntryEntitySchema,
        focusNoteOnMount: boolean,
        onunlinkentity: EventHandler,
        onchange?: () => void
    };
    let {
        linkedEntity,
        focusNoteOnMount,
        onunlinkentity,
        onchange
    }: Props = $props();

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
    let entityLink = $derived.by(() => {
        if (entity == null || entityType == null) {
            //console.debug('entityLink -> entity or entityType is null');
            return '';
        }
        // console.debug('entityLink ->', entityType.linkFn);
        const linkFn = entityTypesStore.getLinkFn(entityType);
        return linkFn(entity);
    });

    let domNoteInput: HTMLSpanElement;
    let focused = $state(false);

    onMount(() => {
        // dirty = linkedEntity.entity == null;
        // userInput = linkedEntity.entity != null ? entityToStr(linkedEntity) : '';
        if (focusNoteOnMount) {
            tick().then(() => domNoteInput.focus());
        }
    });

    function handleChangeNote() {
        if (onchange) onchange();
    }

</script>

<div class="x-entity" transition:slide={{duration: 120}}>
    <div class="x-label" title="{entityDisplay} [#{entity?.id}]">
        {#if entityType?.icon}
            <i class="fa-fw fa-xs {entityType?.icon}"></i>
        {/if}
        {entityDisplay ? entityDisplay : '?'}
    </div>
    <div class="x-note"
         role="textbox"
         tabindex="0"
         contenteditable="true"
         spellcheck="false"
         bind:this={domNoteInput}
         bind:textContent={linkedEntity.note}
         oninput={handleChangeNote}
         onclick={ev=>{ev.stopPropagation();ev.preventDefault()}}></div>
    {#if appStore.ctrlKeyPressed}
        <div class="x-side">
            <!--            <button class="fas fa-fw fa-sm fa-filter"-->
            <!--                    aria-label="Filtrar" title="Filtrar"-->
            <!--                    onclick={handleClickEdit}></button>-->
            <!--            <button class="fas fa-fw fa-sm fa-pen"-->
            <!--                    aria-label="Editar" title="Editar"-->
            <!--                    onclick={handleClickEdit}></button>-->
            {#if entityLink}
            <a class="fas fa-fw fa-sm fa-link x-btn-delete"
               aria-label="Ir a" title="Ir a"
               href={entityLink}
               target="_blank"
               rel="noopener noreferrer"></a>
            {/if}
            <button class="far fa-fw fa-sm fa-trash x-btn-delete"
                    aria-label="Quitar" title="Quitar"
                    onclick={(ev) => {ev.stopPropagation();ev.preventDefault();onunlinkentity();}}></button>
        </div>
    {/if}
</div>

<style lang="scss">
    .x-entity {
        font-size: 11px;
        padding: 0 4px;
        border-bottom: 1px dotted var(--table-sep-color);
        display: flex;
        padding-right: 12px;
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
    .x-note {
        flex: 0 0 auto;
        border-right: 1px solid transparent;
        border-left: 1px solid transparent;
        border-radius: 1px;
        outline: 0;
        padding: 0 2px !important;
        margin: 0;
        font-size: 10px;
        width: auto;
        font-weight: 600;
        color: #999;
        min-width: 2px;
        max-width: 50px;
        &:not(:empty) {
            background-color: rgba(0, 0, 0, 0.04);
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        &:focus {
            background-color: var(--color-focused);
            border-left: 1px dotted var(--table-sep-color);
            border-right: 1px dotted var(--table-sep-color);
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

    .x-btn-delete {
        color: #aaa;
        text-decoration: none;
    }
    .x-btn-delete:hover {
        color: var(--color-icon-hover);
        cursor: pointer;
    }
</style>