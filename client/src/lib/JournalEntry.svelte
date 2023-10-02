<script lang="ts">
    import JEntryDateTime from '$lib/JEntryDateTime.svelte';
    import JEntryEntities from '$lib/JEntryEntities.svelte';
    import JEntryTopicCell from '$lib/JEntryTopicCell.svelte';
    import JEntryUpdates from '$lib/JEntryUpdates.svelte';
    import type { JEntry } from '$lib/types/JEntry';
    import { DateTime } from 'luxon';
    import autosize from 'autosize';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import tippy from 'tippy.js';

    const dispatch = createEventDispatcher();

    // Propiedad entry y valor por defecto
    export let entry: JEntry = {
        createdAt: new Date().toISOString(),
        topic: '',
        updates: [],
        entities: []
    };

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    $: isNew = entry.id === undefined;
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = isNew;
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = false;

    // Mostraremos el id en hexadecimal
    /** Id del registro en hexadecimal. */
    $: hexId = entry.id != null ? Number(entry.id).toString(16) : null;

    // DOM
    let domTopicTextarea: HTMLTextAreaElement;
    let domIdIcon: HTMLElement;

    // Hooks
    onMount(() => {
        // Cuando se cree el componente, si se trata de un nuevo registro,
        // lo enviamos a basede datos de forma inmediata
        if (isNew) {
            save();
        }

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

    /** Guarda el registro en la base de datos (solo la entidad principal). */
    async function save() {
        isSaving = true;
        try {
            let response;
            if (isNew) {
                response = await fetch(`http://localhost:3000/journal/entries`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(entry)
                });
            } else {
                response = await fetch(`http://localhost:3000/journal/entries/${entry.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(entry)
                });
            }
            if (response.ok) {
                const json = await response.json();
                // Si el registro es nuevo, le asignamos el id que nos devuelve el servidor
                if (isNew)
                    entry.id = json.id;
                isUnsaved = false;
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSaving = false;
        }
    }

    /** Elimina el registro de la base de datos. */
    async function remove() {
        if (isNew) {
            dispatch('delete', entry);
            return;
        }
        try {
            isSaving = true;
            const response = await fetch(`http://localhost:3000/journal/entries/${entry.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                dispatch('delete', {
                    entry: entry
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSaving = false;
        }
    }

</script>

<tr>
    <td>
        <div class="status"
             class:new={isNew}
             class:saving={isSaving}
             class:unsaved={isUnsaved} />
    </td>
    <td>
        <span id="fld-id">
            <i class="fas fa-hashtag fa-fw fa-sm"
               bind:this={domIdIcon}
               data-tippy-placement="right"
               data-tippy-content={entry.id != null ? entry.id : '*'} />
        </span>
    </td>
    <td>
        <JEntryDateTime
                bind:isodate={entry.createdAt}
                bind:includeTime={entry.createdAtShowsTime}
                on:change={dirty} />
    </td>
    <td>
        <JEntryTopicCell bind:value={entry.topic}
                         on:change={dirty} />
    </td>
    <td class="x-cell-updates">
        <JEntryUpdates entry={entry.id} bind:updates={entry.updates} />
    </td>
    <td>
        <JEntryEntities entry={entry.id} entities={entry.entities} />
    </td>
    <td>
        <select>

        </select>
    </td>
    <td>
        <JEntryDateTime bind:isodate={entry.updatedAt}
                        bind:includeTime={entry.updatedAtShowsTime}
                        on:change={dirty} />
    </td>
    <td>
        <button on:click={remove}>
            <i class="fas fa-xmark fa-fw fa-sm" />
        </button>
    </td>
</tr>

<style>


    tr {
        font-weight: 700;
        text-align: left;
    }

    td {
        padding: 1px;
        border: 1px solid #bbb;
    }

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