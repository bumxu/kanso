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
    let { value = $bindable(), ondelete }:
        { value: EntreUpdateSchema, ondelete: (id: string) => any } = $props();

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    let isNew = false;//value.id === undefined;
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = isNew;
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = false;

    let focused = $state(false);

    // DOM
    let domBodyTextarea: HTMLTextAreaElement;

    // Hooks
    onMount(async () => {
        //autosize(domBodyTextarea);
    });

    /** Elimina el registro de la base de datos. */
    async function remove() {
        ondelete(value.id);
    }
</script>

<div class="x-entry-update" xfocused={focused}>
    <JEntryDateTime bind:value={value.date}
                    placeholder="Fecha" />

    <div class="x-date-ce" contenteditable="true"
         spellcheck="false"
         onfocus={() => focused=true}
         onblur={() => focused=false}></div>

    <div class="x-body-ce" contenteditable="true" bind:textContent={value.body}
         spellcheck="false"
         onfocus={() => focused=true}
         onblur={() => focused=false}></div>

    <button onclick={remove} title="Eliminar"><i class="fad fa-sm fa-fw fa-trash"></i></button>
</div>

<style lang="scss" global>

    .x-entry-update {
        padding: 1px;
    }
    .x-entry-update.focused {
        background-color: #ffffD6;
    }

    .x-date-ce {
        display: inline-block;
        font-family: "Noto Sans", sans-serif;
        font-size: 0.625rem;
        text-rendering: optimizeLegibility;
        resize: none;
        box-sizing: border-box;
        padding: 0 8px;
        border: 0;
        background: #d59898;
        position: relative;
        outline: 0;

        &:hover, &:focus {
            //background: rgba(0, 0, 0, 0.05);
        }

        &:not(:empty) {
            display: inline;
        }

        &:not(:focus):empty:before {
            content: '·';
            position: absolute;
        //    //color: rgba(0, 0, 0, 0.3);
        //    font-weight: 600;
        //    pointer-events: none;
        }
    }

    .x-body-ce {
        display: inline;
        font-family: "Noto Sans", sans-serif;
        font-size: 0.625rem;
        text-rendering: optimizeLegibility;
        resize: none;
        box-sizing: border-box;
        padding: 0 3px;
        border: 0;
        outline: 0;

        &:hover, &:focus {
            background: rgba(0, 0, 0, 0.05);
        }

        &:not(:focus):empty:before {
            content: '· · ·';
            color: rgba(0, 0, 0, 0.3);
            font-weight: 600;
            pointer-events: none;
        }
    }

    //.x-body-ce:not(:focus):empty:before {
    //    content: "\f246";
    //    font-family: "Font Awesome 6 Pro";
    //    font-weight: 700;
    //    pointer-events: none;
    //}

    //.x-body-ce:not(:focus):empty {
    //    cursor: text;
    //    width: 14px;
    //    background: rgba(0, 0, 0, 0.1);
    //    border-radius: 2px;
    //    display: inline-block;
    //}

    //.x-body-ce:focus:before {
    //    content: '';
    //    display: none;
    //}
</style>