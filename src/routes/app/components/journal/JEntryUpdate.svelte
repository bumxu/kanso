<script lang="ts">
    import type { EntryUpdateSchema } from '$lib/types/j4_types';
    import { DateTime } from 'luxon';
    import { tick } from 'svelte';
    import { fade } from 'svelte/transition';
    import { appStore } from '../../appstate.store.svelte.js';
    import JEntryUpdateDatetime from './JEntryUpdateDatetime.svelte';

    type Props = {
        value: EntryUpdateSchema;
        ondelete?: (id: string) => any;
        onchange?: () => any;
        onfocus?: () => any;
        onblur?: () => any;
    };
    let { value = $bindable(), onchange, ondelete, onfocus, onblur }: Props = $props();

    // Estados
    /** Indica que el registro es nuevo (valor automático si no tiene id asignado). */
    let isNew = false;//value.id === undefined;
    /** Indica que el registro tiene cambios sin guardar. */
    let isUnsaved = isNew;
    /** Indica que los cambios en el registro se están guardando. */
    let isSaving = false;

    let dateInputValue = $state('');
    // let dateInputFocused = $state(false);
    let dateInputVisible = $state(!!value.date); //$derived(value.date || appStore.focusedElement === domDateInput);

    let focused = $derived(appStore.focusedElement === domDateInput || appStore.focusedElement === domTextInput);

    // DOM
    let domDateInput: HTMLDivElement;
    let domTextInput: HTMLDivElement;
    let blurTimeout: number;

    export function focus() {
        if (!focused) {
            domTextInput.focus();
        }
    }

    /** Elimina el registro de la base de datos. */
    async function handleClickDelete(ev: MouseEvent) {
        ev.stopPropagation();
        if (ondelete) ondelete(value.id);
    }

    function handleDateInputFocus() {
        if (onfocus && !focused) onfocus();
    }
    function handleDateInputBlur() {
        if (!value.date) {
            dateInputVisible = false;
        }
        clearTimeout(blurTimeout);
        blurTimeout = window.setTimeout(() => {
            if (!focused) {
                console.debug(`Emitiendo evento blur para entry update #${value.id}`);
                if (onblur) onblur();
            }
        }, 1000);
    }
    async function handleClickAddDate(ev: MouseEvent) {
        ev.stopPropagation();
        value.date = DateTime.now().toFormat('yyyyMMddHHmm');
        dateInputVisible = true;
        await tick();
        domDateInput.focus();
    }

    function handleTextInputFocus() {
        if (onfocus && !focused) onfocus();
    }
    function handleTextInputBlur() {
        clearTimeout(blurTimeout);
        blurTimeout = window.setTimeout(() => {
            if (!focused) {
                console.debug(`Emitiendo evento blur para entry update #${value.id}`);
                if (onblur) onblur();
            }
        }, 1000);
    }

    function handleTextInputPaste(ev: ClipboardEvent) {
        ev.preventDefault();
        document.execCommand('insertText', false, ev.clipboardData?.getData('text/plain'));
    }

</script>

<div class="x-entry-update" class:focused={focused} out:fade={{duration: 120}}>

    <div class="x-group-input" style="flex: 1">

        <!--        <div class="x-date-input"-->
        <!--             class:hidden={!dateInputVisible}-->
        <!--             contenteditable="true"-->
        <!--             spellcheck="false"-->
        <!--             bind:this={domDateInput}-->
        <!--             bind:textContent={value.date}-->
        <!--             onfocus={handleDateInputFocus}-->
        <!--             onblur={handleDateInputBlur}></div>-->
        {#if dateInputVisible}
            <JEntryUpdateDatetime
                    bind:value={value.date}
                    bind:domInput={domDateInput}
                    {onchange}
                    onfocus={handleDateInputFocus}
                    onblur={handleDateInputBlur} />
        {/if}

        <i class="fad fa-fw fa-xs fa-calendar-xmark"
           class:hidden={dateInputVisible}
           style="color: #666; cursor: pointer"
           onclick={handleClickAddDate}></i>

        <div class="x-text-input"
             contenteditable="true"
             bind:textContent={value.body}
             bind:this={domTextInput}
             spellcheck="false"
             oninput={onchange}
             onfocus={handleTextInputFocus}
             onblur={handleTextInputBlur}
             onpaste={handleTextInputPaste}></div>
    </div>

    <div style="flex: 0 auto; padding-right: 3px">
        <button onclick={handleClickDelete} title="Eliminar">
            <i class="far fa-xs fa-fw fa-trash" class:hidden={!appStore.ctrlKeyPressed} style="color: #aaa"></i></button>
        <!--        <button title="Más opciones"><i class="fas fa-sm fa-fw fa-ellipsis-vertical"></i></button>-->
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
            padding: 1px 4px;
            cursor: text;
        }
    }

    .x-text-input {
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

    .hidden {
        display: none !important;
    }
</style>