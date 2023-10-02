<script lang="ts">
    import JEntryDateTime from '$lib/JEntryDateTime.svelte';
    import autosize from 'autosize';
    import { createEventDispatcher, onMount, afterUpdate } from 'svelte';

    const dispatch = createEventDispatcher();

    export let entry: number | null = null;
    export let value: { id?: number, date: string | null, body: string } = {
        date: null,
        body: ''
    };

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    let isNew = value.id === undefined;
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = isNew;
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = false;

    // DOM
    let domBodyTextarea: HTMLTextAreaElement;

    // Hooks
    onMount(async () => {
        // Cuando se cree el componente, si se trata de un nuevo registro,
        // lo enviamos a basede datos de forma inmediata
        if (isNew) {
            save();
        }

        autosize(domBodyTextarea);
    });

    /** Marca el registro como modificado y lanza el proceso de guardado diferido. */
    async function dirty() {
        console.log('dirty');
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
                response = await fetch(`http://localhost:3000/journal/entries/${entry}/updates`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(value)
                });
            } else {
                response = await fetch(`http://localhost:3000/journal/entries/${entry}/updates/${value.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(value)
                });
            }
            if (response.ok) {
                const json = await response.json();
                // Si el registro es nuevo, le asignamos el id que nos devuelve el servidor
                if (isNew) {
                    value.id = json.id;
                    isNew = false;
                }
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
            const response = await fetch(`http://localhost:3000/journal/entries/${entry}/updates/${value.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                dispatch('delete', {
                    item: value
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="x-entry-update">
    <JEntryDateTime bind:isodate={value.date}
                    includeTime={true}
                    on:change={dirty}
                    placeholder="Fecha" />
    <textarea rows="1"
              bind:this={domBodyTextarea}
              bind:value={value.body}
              on:input={dirty} />
    <button on:click={remove} title="Eliminar"></button>
</div>

<style lang="scss" global>

</style>