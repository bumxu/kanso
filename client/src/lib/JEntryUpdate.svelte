<script lang="ts">
    import { SERVER_HOST } from '$lib/constants';
    import JEntryDateTime from '$lib/journal_table/JDateTime.svelte';
    import type { EntreUpdateSchema } from '$lib/types/j4_types';
    import autosize from 'autosize';
    import { onMount } from 'svelte';

    //const dispatch = createEventDispatcher();

    //export let entry: number | null = null;
    // export let value: { id?: number, date: string | null, body: string } = {
    //     date: null,
    //     body: ''
    // };
    let { value=$bindable(), ondelete }:
        { value: EntreUpdateSchema, ondelete: (id: string) => any } = $props();

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    let isNew = false;//value.id === undefined;
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = isNew;
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = false;

    // DOM
    let domBodyTextarea: HTMLTextAreaElement;

    // Hooks
    onMount(async () => {
        autosize(domBodyTextarea);
    });

    /** Elimina el registro de la base de datos. */
    async function remove() {
        ondelete(value.id);
    }
</script>

<div class="x-entry-update">
    <JEntryDateTime bind:value={value.date}
                    placeholder="Fecha" />
    <textarea rows="1"
              bind:this={domBodyTextarea}
              bind:value={value.body}
              spellcheck="false"></textarea>
    <button onclick={remove} title="Eliminar"><i class="fas fa-circle-minus"></i></button>
</div>

<style lang="scss" global>

</style>