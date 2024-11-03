<script lang="ts">
    import { DateTimeHelper } from '$lib/helpers/datetime.helper.js';
    import type { Nil } from '$lib/types/j4_types';
    import { Utils } from '$lib/Utils';
    import { DateTime } from 'luxon';

    type Props = {
        value: string | undefined,
        domInput?: HTMLElement,
        onchange?: () => void,
        onfocus?: () => any,
        onblur?: () => any,
    };

    let {
        /** El valor es una cadena de texto con formato yyyyMMdd o yyyyMMddHHmm. */
        value = $bindable(), domInput = $bindable(),
        onchange, onfocus, onblur
    }: Props = $props();

    let inputValue: string = $state(formatValue(value) || '');
    let focused = $state(false);
    //let domInput: HTMLElement;

    $effect(() => {
        inputValue = formatValue(value) || '';
    });

    export function focus() {
        domInput.focus();
    }

    // Valores volátiles mientras se edita el campo
    let valid = $state(true);
    let unsavedValue = $state(value);
    // let unsavedDatetime: DateTime | null = Utils.parseDateServer(value);
    // let valueStr = unsavedDatetime != null
    //     ? unsavedDatetime.toFormat(includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy')
    //     : '';
    //let unsavedIncludeTime = includeTime;

    // $effect(() => {
    //     if (isodate != null) {
    //         unsavedDatetime = Utils.parseDateServer(isodate);
    //         valueStr = unsavedDatetime != null
    //             ? unsavedDatetime.toFormat(includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy')
    //             : '';
    //     }
    // });

    // Disparar evento change cuando cambien los valores del componente
    // $: dispatch('change', {
    //     isodate,
    //     includeTime
    // });

    function handleInput(evt: any) {
        try {
            const parsed: string = DateTimeHelper.parseUserDate(evt.target!.textContent);
            //unsavedDatetime = parsed.datetime;
            //unsavedIncludeTime = parsed.includeTime;
            unsavedValue = parsed;
            valid = true;
            //console.debug('input -> valid: unsavedDatetime: ' + unsavedDatetime + ', unsavedIncludeTime: ' + unsavedIncludeTime);
            console.debug('input -> valid date: ' + parsed);
        } catch (e) {
            valid = false;
            console.debug('input -> invalid date', e);
        }
    }

    function handleKeydown(evt: KeyboardEvent) {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            handleApply(true);
        } else if (evt.key === 'Escape') {
            handleCancel();
        }
    }

    function handleFocus() {
        focused = true;
        if (onfocus) onfocus();

        //domInput.select();
        const range = document.createRange();
        range.selectNodeContents(domInput);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    function handleBlur() {
        focused = false;
        if (onblur) onblur();
        handleApply();
    }

    function handleApply(force: boolean = false) {
        if (valid && (value !== unsavedValue || force)) {
            value = unsavedValue;
            inputValue = formatValue(value);
            if (onchange) onchange();
            console.debug('apply -> ' + value);
        }
    }

    function handleCancel() {
        //unsavedDatetime = Utils.parseDateServer(value);
        //unsavedIncludeTime = includeTime;
        /*valueStr = unsavedDatetime != null
            ? unsavedDatetime.toFormat(includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy')
            : '';*/
        inputValue = formatValue(value);
        unsavedValue = value;
        valid = true;
    }

    function formatValue(value: Nil<string>) {
        if (value == null || value === '') {
            return '';
        }
        const dt = value.length === 8
            ? DateTime.fromFormat(value, 'yyyyMMdd')
            : DateTime.fromFormat(value, 'yyyyMMddHHmm');
        const str = value.length === 8
            ? dt.toFormat('dd/MM/yy')
            : dt.toFormat('dd/MM/yy HH:mm');
        const today = DateTime.now().toFormat('dd/MM/yy');
        const yesterday = DateTime.now().minus({ days: 1 }).toFormat('dd/MM/yy');
        return str.replace(today, 'Hoy').replace(yesterday, 'Ayer');
    }
</script>

<!--     class:hidden={!dateInputVisible}-->
<div class="x-date-input"
     role="textbox"
     tabindex="0"
     contenteditable="true"
     spellcheck="false"
     bind:this={domInput}
     bind:textContent={inputValue}
     oninput={handleInput}
     onfocus={handleFocus}
     onblur={handleBlur}
     onkeydown={handleKeydown}></div>

<style lang="scss">
    .x-date-input {
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
</style>