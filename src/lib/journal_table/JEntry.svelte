<script lang="ts">
    import JEntryTopicCell from '$lib/JEntryTopicCell.svelte';
    import JEntryUpdates from '$lib/JEntryUpdates.svelte';
    import JDateTimeCell from '$lib/journal_table/JDateTimeCell.svelte';
    import JEntities from '$lib/journal_table/JEntities.svelte';
    import JTagsCell from '$lib/journal_table/JTagsCell.svelte';
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte';
    import type { EntrySchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';
    import tippy from 'tippy.js';
    import JDateTime from './JDateTime.svelte';

    type Props = {
        entry: EntrySchema,
        partitionId: string,
        onpartitionchange: (entry: EntrySchema, currPartId: string) => void
    };

    const { entry = $bindable(), partitionId, onpartitionchange }: Props = $props();

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

    // Hooks
    onMount(() => {
        //     // Cuando se cree el componente, si se trata de un nuevo registro,
        //     // lo enviamos a basede datos de forma inmediata
        //     if (isNew) {
        //         save();
        //     }

        //console.debug('JEntry mounted for entry', entry.id);

        // Tippy
        tippy(domIdIcon);
    });

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

<div class="x-row">
    <div>
        <span id="fld-id">
            <i class="fas fa-hashtag fa-fw fa-sm"
               bind:this={domIdIcon}
               data-tippy-placement="right"
               data-tippy-content={entry.id != null ? entry.id : '*'} />
        </span>
    </div>

    <div>
        <i class="fad fa-sm fa-fw fa-play"></i>
        <JDateTime bind:value={entry.dateSince}
                   onchange={()=>{
                           if (entry.dateSince.substring(0, 6) !== partitionId) {
                               onpartitionchange(entry, partitionId);
                           }
                           }} />
        <i class="fad fa-sm fa-fw fa-flag-checkered"></i>
        <JDateTime bind:value={entry.dateDue} />
        <i class="fad fa-sm fa-fw fa-check"></i>
        <JDateTime bind:value={entry.dateClosed} />

    </div>
    <div>
        <JEntryTopicCell bind:value={entry.subject} />
    </div>
    <div class="x-cell-updates">
        <JEntryUpdates entryId={entry.id} bind:updates={entry.updates} />
    </div>
    <div>
        <JEntities entryId={entry.id} entities={entry.entities} />
    </div>
    <div>
        <JTagsCell entryId={entry.id} bind:tagsIds={entry.tags} />
    </div>
    <div>
        <!--        <JPriorityCell bind:value={entry.priority} />-->
    </div>
    <div>
        <select bind:value={entry.status}>
            {#each statusesStore.statuses as status, i (status.id) }
                <option value={status.id}>{status.name}</option>
            {/each}
        </select>
    </div>
    <div>
        <!--        <button class="btn btn-sm btn-ic" on:click={remove}>-->
        <!--            <i class="fas fa-xmark fa-fw fa-sm" />-->
        <!--        </button>-->
    </div>
</div>

<style>

    #fld-id {
        font-size: 10px;
        font-family: 'Roboto Mono', monospace;
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
</style>