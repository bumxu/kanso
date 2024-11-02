<script lang="ts">
    import { SERVER_HOST } from '$lib/constants';
    import JEntryDateTime from '$lib/journal_table/JDateTime.svelte';
    import type { EntryUpdateSchema } from '$lib/types/j4_types';
    import { DateTime } from 'luxon';
    //import autosize from 'autosize';
    import { onMount, tick } from 'svelte';

    //const dispatch = createEventDispatcher();

    //export let entry: number | null = null;
    // export let value: { id?: number, date: string | null, body: string } = {
    //     date: null,
    //     body: ''
    // };
    let { value = $bindable(), ondelete }:
        { value: EntryUpdateSchema, ondelete: (id: string) => any } = $props();

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
    let domDateInput: HTMLDivElement;

    // Hooks
    onMount(async () => {
        //autosize(domBodyTextarea);
    });

    /** Elimina el registro de la base de datos. */
    async function remove() {
        ondelete(value.id);
    }

    function handleFocusDateInput() { dateInputFocused = true; }
    function handleBlurDateInput() { dateInputFocused = false; }
    async function handleClickAddDate(ev: GenericInputEvent) {
        ev.stopPropagation();
        dateInputFocused = true;
        await tick();
        domDateInput.focus();
        dateInputValue = DateTime.now().toFormat('yyyy/MM/dd HH:mm');
    }

    let dateInputValue = $state('');
    let dateInputFocused = $state(false);
    let dateInputVisible = $derived(dateInputValue || dateInputFocused);
</script>

<div class="x-entry-update" class:focused={focused}>
    <!--    <JEntryDateTime bind:value={value.date}-->
    <!--                    placeholder="Fecha" />-->

    <div class="x-group-input" style="flex: 1">

        <div class="x-date-ce"
             class:hidden={!dateInputVisible}
             contenteditable="true"
             spellcheck="false"
             bind:this={domDateInput}
             bind:textContent={dateInputValue}
             onfocus={() => {handleFocusDateInput(); focused=true;} }
             onblur={() => {handleBlurDateInput(); focused=false;} }></div>

        <i class="fad fa-fw fa-xs fa-calendar-xmark"
           class:hidden={dateInputVisible}
           style="color: #666; cursor: pointer"
           onclick={handleClickAddDate}></i>

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

<style lang="scss">

    .x-entry-update {
        position: relative;
        box-sizing: border-box;
        display: flex;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--color-hovered);
        }
        &.focused {
            background-color: var(--color-focused);
        }

        .x-group-input {
            border-right: 1px dotted var(--table-sep-color);
            padding: 1px 4px;
            cursor: text;
        }

        .x-datetime-input {
            font-size: 9px;
            width: 94px;
            padding: 1px 2px;
            display: none;
        }

    }


    .x-date-ce {
        display: inline-block;
        font-size: 10px;
        text-rendering: optimizeLegibility;
        box-sizing: border-box;
        padding: 0;
        margin-right: 2px;
        font-weight: 400;
        border: 0;
        min-width: 9px;
        color: #aaa;
        //background: #d59898;
        position: relative;
        outline: 0;
        border-right: 1px dotted var(--table-sep-color);
        padding-right: 6px;

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
        font-size: 10.6px;
        text-rendering: optimizeLegibility;
        box-sizing: border-box;
        font-weight: 450;
        padding: 0;
        border: 0;
        outline: 0;

        //&:hover, &:focus {
        //    background: rgba(0, 0, 0, 0.05);
        //}

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

    .hidden {
        display: none !important;
    }
</style>