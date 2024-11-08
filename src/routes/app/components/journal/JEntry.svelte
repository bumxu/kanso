<script lang="ts">
    import { appStore } from '../../appstate.store.svelte';
    import JEntryUpdates from './JEntryUpdates.svelte';
    import JDateTime from '$lib/components/JDateTime.svelte';
    import JEntryTags from './JEntryTags.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte';
    import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte.js';
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte.js';
    import type { EntrySchema } from '$lib/types/j4_types';
    import { DateTime } from 'luxon';
    import { type Component, onMount, type SvelteComponent, tick } from 'svelte';
    import tippy from 'tippy.js';
    import JEntryDateSince from './JEntryDateSince.svelte';
    import JEntryEntities from './JEntryEntities.svelte';
    import JEntryTopic from './JEntryTopic.svelte';
    //import { slide, crossfade } from 'svelte/transition';

    //const [send, receive] = crossfade({ fallback: slide });

    type Props = {
        entry: EntrySchema,
        partitionId: string,
        autofocus?: boolean,
        onpartitionchange: (entry: EntrySchema, currPartId: string) => void,
        ondelete: () => void,
        onshowctxmenu: (ev: MouseEvent, entry: EntrySchema) => void
    };
    const { entry = $bindable(), partitionId, onpartitionchange, ondelete, autofocus, onshowctxmenu }: Props = $props();

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    let isNew = $derived(entry.id === undefined);
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = $state(isNew);
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = $state(false);

    // // Mostraremos el id en hexadecimal
    // /** Id del registro en hexadecimal. */
    // $: hexId = entry.id != null ? Number(entry.id).toString(16) : null;
    //
    // // DOM
    // let domTopicTextarea: HTMLTextAreaElement;
    let domIdIcon: HTMLElement;
    let svTopic: SvelteComponent;

    // Hooks
    onMount(() => {
        if (autofocus) {
            tick().then(() => svTopic.focus());
        }
        // if (entry.dateUpdated == null) {
        //     entry.dateUpdated = entry.dateClosed ?? entry.dateSince;
        // }
        //     // Cuando se cree el componente, si se trata de un nuevo registro,
        //     // lo enviamos a basede datos de forma inmediata
        //     if (isNew) {
        //         save();
        //     }

        //console.debug('JEntry mounted for entry', entry.id);

        // Tippy
        tippy(domIdIcon);
    });

    let hasFinalStatus = $derived.by(() => {
        const id = entry.status;
        if (id != null) {
            const status = statusesStore.get(id);
            return status != null && status.final;
        }
        return false;
    });

    function handleStatusChange() {
        const id = entry.status;
        if (id != null) {
            const status = statusesStore.get(id);
            if (status != null && !entry.dateClosed && status.final) {
                entry.dateClosed = DateTime.local().toFormat('yyyyMMddHHmm');
            }
        }
    }

    /** Marca el registro como modificado y lanza el proceso de guardado diferido. */
    async function dirty() {
        if (!isUnsaved) {
            isUnsaved = true;
            setTimeout(() => save(), 800);
        }
    }

    // /** Guarda el registro en la base de datos (solo la entidad principal). */
    // async function save() {
    //     isSaving = true;
    //     try {
    //         let response;
    //         if (isNew) {
    //             response = await fetch(`${SERVER_HOST}/api/journal/entries`, {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify(entry)
    //             });
    //         } else {
    //             response = await fetch(`${SERVER_HOST}/api/journal/entries/${entry.id}`, {
    //                 method: 'PUT',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify(entry)
    //             });
    //         }
    //         if (response.ok) {
    //             const json = await response.json();
    //             // Si el registro es nuevo, le asignamos el id que nos devuelve el servidor
    //             if (isNew)
    //                 entry.id = json.id;
    //             isUnsaved = false;
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         isSaving = false;
    //     }
    // }
    //
    // /** Elimina el registro de la base de datos. */
    // async function remove() {
    //     if (isNew) {
    //         dispatch('delete', entry);
    //         return;
    //     }
    //     try {
    //         isSaving = true;
    //         const response = await fetch(`${SERVER_HOST}/api/journal/entries/${entry.id}`, {
    //             method: 'DELETE'
    //         });
    //         if (response.ok) {
    //             console.debug(`Registro ${entry.id} eliminado con éxito`);
    //             dispatch('delete', {
    //                 entry: entry
    //             });
    //         } else {
    //             const body = await response.text();
    //             throw new Error(`(${response.status}) ${body}`);
    //         }
    //     } catch (e) {
    //         console.error(`Error al eliminar el registro ${entry.id} -`, e);
    //     } finally {
    //         isSaving = false;
    //     }
    // }

</script>

<div class="x-row" class:faded={hasFinalStatus}>
    <div class="x-cell">
        <JEntryDateSince entry={entry} />
    </div>
    <div class="x-cell">
        <JEntryTopic entryId={entry.id} bind:value={entry.subject} bind:this={svTopic} />
    </div>
    <div class="x-cell">
        <JEntryUpdates entryId={entry.id} bind:updates={entry.updates} />
    </div>
    <div class="x-cell">
        <JEntryEntities entryId={entry.id} bind:entities={entry.entities} />
    </div>
    <div class="x-cell">
        <JEntryTags entryId={entry.id} bind:tagsIds={entry.tags} />
    </div>
    <div class="x-cell">
        <select bind:value={entry.priority}>
            <option value={undefined}></option>
            {#each Object.values(prioritiesStore.priorities) as priority, i (priority.id)}
                <option value={priority.id}>{priority.name}</option>
            {/each}
        </select>

        <div class="x-dt-wrapper">
            <i class="fad fa-xs fa-fw fa-flag-checkered"></i>
            <JDateTime bind:value={entry.dateDue} />
        </div>
        <!--        <input type="text" bind:value={entry.priority} style="border: 1px solid #333; width: 50px" />-->
        <!--        <JPriorityCell bind:value={entry.priority} />-->
    </div>
    <div class="x-cell">
        <select bind:value={entry.status} onchange={()=>handleStatusChange()}>
            <option value={undefined}></option>
            {#each Object.values(statusesStore.statuses) as status, i (status.id)}
                <option value={status.id}>{status.name}</option>
            {/each}
        </select>

        <div class="x-dt-wrapper">
            <i class="fad fa-xs fa-fw fa-check"></i>
            <JDateTime bind:value={entry.dateClosed} />
        </div>
        <!--        <input type="text" bind:value={entry.status} style="border: 1px solid #333; width: 50px" />-->
        <!--        <select bind:value={entry.status}>-->
        <!--            {#each statusesStore.statuses as status, i (status.id) }-->
        <!--                <option value={status.id}>{status.name}</option>-->
        <!--            {/each}-->
        <!--        </select>-->
    </div>
    <div class="x-cell text-center">
        {#if appStore.ctrlKeyPressed}
            <i class="far fa-trash fa-fw fa-sm x-btn-delete"
               title="Eliminar"
               style="cursor: pointer" onclick={ondelete}></i>
        {:else}
            <i class="far fa-ellipsis fa-fw fa-sm"
               title="Acciones"
               style="cursor: pointer" onclick={(ev)=>{onshowctxmenu(ev,entry)}}></i>
        {/if}
    </div>
</div>

<style lang="scss">
    .x-row {
        //&.faded:not(:hover) {
        //    pointer-events: none;
        //}
        &.faded:not(:hover) :global(.x-cell > *) {
            filter: blur(1px);
            opacity: 0.15;
        }
        &.faded:hover :global(.x-cell > *) {
            opacity: 0.5;
        }
    }

    .x-dt-wrapper {
        text-wrap: nowrap;
        height: 16px;
        line-height: 16px;
        display: flex;
        align-items: center;
        border-bottom: 1px dotted var(--table-sep-color);

        i {
            margin: 0 0 0 2px;
            color: #aaa;
        }

        input {
            vertical-align: middle;
        }
    }

    #fld-id {
        font-size: 9px;
    }

    .status {
        width: 8px;
        height: 100%;
        background: #fff;
    }

    .status.unsaved {
        background: #d0d0d0;
    }

    .status.saving {
        background: #509f56;
    }

    .status.new {
        background: #e5c65e;
    }

    select {
        font-size: 10.6px;
        font-weight: 500;
        padding: 0;
        width: 100%;
        display: block;
        margin: 0;
        border-radius: 0;
        background-color: #f5f5f5;
        outline: none;
        border: none;
        color: #555;
        border-bottom: 1px dotted var(--table-sep-color);

        &:hover, &:focus {
            background-color: #ddd;
            color: #333;
        }
        &:focus {
            box-shadow: inset 0 0 0 1px rgba(47, 56, 66, 0.25);
        }
    }

    .x-btn-delete {
        color: #aaa
    }
    .x-btn-delete:hover {
        color: var(--color-icon-hover);
        cursor: pointer;
    }
</style>