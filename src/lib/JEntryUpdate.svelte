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
    <!--    <JEntryDateTime bind:value={value.date}-->
    <!--                    placeholder="Fecha" />-->

    <div style="display: flex">
        <div style="flex: 1">

            <div class="x-date-ce" contenteditable="true"
                 spellcheck="false"
                 onfocus={() => focused=true}
                 onblur={() => focused=false}></div>

            <div class="x-body-ce" contenteditable="true" bind:textContent={value.body}
                 spellcheck="false"
                 onfocus={() => focused=true}
                 onblur={() => focused=false}></div>
        </div>

        <div style="flex: 0 auto; padding-right: 5px">
            <button onclick={remove} title="Eliminar"><i class="fas fa-sm fa-fw fa-xmark"></i></button>
            <button title="Más opciones"><i class="fas fa-sm fa-fw fa-ellipsis-vertical"></i></button>
        </div>
    </div>
</div>

<style lang="scss">

    .x-entry-update {
        //background: rgba(0, 0, 0, 0.03);
        //padding: 1px;
        position: relative;


        .x-datetime-input {
            font-size: 9px;
            width: 94px;
            padding: 1px 2px;
            display: none;
        }

        textarea {
            width: calc(100% - 30px);
            font-family: 'Noto Sans', sans-serif;
            font-size: 0.68rem;
            font-weight: 400;
            padding: 2px 4px 3px;
            text-rendering: optimizeLegibility;

            &:hover {
                background: rgba(0, 0, 0, 0.03);
            }
            &:focus {
                background-color: #ffffD6;
            }
        }

        //button {
        //    position: absolute;
        //    right: 3px;
        //    top: 3px;
        //    width: 15px;
        //    height: 15px;
        //    background-size: contain;
        //    background-repeat: no-repeat;
        //    background-position: center;
        //    background-color: transparent;
        //    border: 0;
        //    cursor: pointer;
        //
        //
        //}
    }

    .x-entry-update {
        padding: 2px 4px;
        box-sizing: border-box;
    }
    .x-entry-update.focused {
        background-color: #ffffD6;
    }

    .x-date-ce {
        display: inline-block;
        font-family: "Noto Sans", sans-serif;
        font-size: 0.625rem;
        text-rendering: optimizeLegibility;
        box-sizing: border-box;
        padding: 0;
        margin-right: 4px;
        font-weight: 600;
        border: 0;
        min-width: 5px;
        //background: #d59898;
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
            cursor: text;
            color: rgba(0, 0, 0, 0.3);
            position: absolute;
            //    //color: rgba(0, 0, 0, 0.3);
            font-weight: 600;
            pointer-events: none;
        }
    }

    .x-body-ce {
        display: inline-block;
        font-family: "Noto Sans", sans-serif;
        font-size: 0.625rem;
        text-rendering: optimizeLegibility;
        box-sizing: border-box;
        padding: 0;
        border: 0;
        outline: 0;

        &:hover, &:focus {
            background: rgba(0, 0, 0, 0.05);
        }

        &:not(:empty) {
            display: inline;
        }

        &:not(:focus):empty:before {
            content: '· · ·';
            cursor: text;
            color: rgba(0, 0, 0, 0.3);
            font-weight: 600;
            position: absolute;
            pointer-events: none;
        }
    }

    button {
        border: 0;
        background: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: block;
        float: left;

        i {
            vertical-align: middle;
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