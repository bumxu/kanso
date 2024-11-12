<script lang="ts">
    import type { Nil } from '$lib/types/j4_types.js';
    import { Utils } from '$lib/Utils.js';
    import { DateTime } from 'luxon';
    import 'tippy.js/dist/tippy.css';

    type Props = {
        value: string | undefined,
        placeholder?: string | undefined,
        required?: boolean,
        onchange?: () => void,
        onfocus?: () => any,
        onblur?: () => any,
    };

    let {
        /** El valor es una cadena de texto con formato yyyyMMdd o yyyyMMddHHmm. */
        value = $bindable(),
        placeholder,
        required,
        onchange, onfocus, onblur
    }: Props = $props();

    let inputValue: string = $state(formatValue(value) || '');
    let focused = $state(false);
    let domInput: HTMLInputElement;

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

    function parseDate(raw: string) {
        console.debug('parseDate', raw);
        let year, month, day;
        if (raw == null || raw === '') {
            return null;
        } else if (/^\d{8}$/.test(raw)) {
            // yyyyMMdd
            year = Number.parseInt(raw.substring(0, 4));
            month = Number.parseInt(raw.substring(4, 6));
            day = Number.parseInt(raw.substring(6, 8));
        } else if (/^\d{6}$/.test(raw)) {
            // yyMMdd
            year = Number.parseInt(raw.substring(0, 2));
            month = Number.parseInt(raw.substring(2, 4));
            day = Number.parseInt(raw.substring(4, 6));
        } else if (/^\d{1,2}\/\d{1,2}\/\d{2}(\d{2})?$/.test(raw)) {
            // d(d)/m(m)/yy(yy)
            const dateSpl = raw.split(/[/.,-]/);
            day = Number.parseInt(dateSpl[0]);
            month = Number.parseInt(dateSpl[1]);
            year = dateSpl[2].length === 4 ? Number.parseInt(dateSpl[2]) : 2000 + Number.parseInt(dateSpl[2]);
        } else if (/^\d{1,2}\/\d{1,2}$/.test(raw)) {
            // d(d)/m(m)
            const dateSpl = raw.split(/[/.,-]/);
            day = Number.parseInt(dateSpl[0]);
            month = Number.parseInt(dateSpl[1]);
            year = new Date().getFullYear();
        } else if (/^\d{1,2}$/.test(raw)) {
            // d(d)
            day = Number.parseInt(raw);
            month = new Date().getMonth() + 1;
            year = new Date().getFullYear();
        } else if (/^(hoy|ayer|mañana)$/i.test(raw)) {
            // hoy, ayer, mañana
            const now = DateTime.local();
            if (/^hoy$/i.test(raw)) {
                year = now.year;
                month = now.month;
                day = now.day;
            } else if (/^ayer$/i.test(raw)) {
                year = now.minus({ days: 1 }).year;
                month = now.minus({ days: 1 }).month;
                day = now.minus({ days: 1 }).day;
            } else if (/^mañana$/i.test(raw)) {
                year = now.plus({ days: 1 }).year;
                month = now.plus({ days: 1 }).month;
                day = now.plus({ days: 1 }).day;
            }
        }

        if (year != null && month != null && day != null) {
            if (month > 12 || month < 1)
                throw new Error('Mes no válido: ' + month + '.');
            if (day > 31 || day < 1)
                throw new Error('Día no válido: ' + day + '.');
            return { year, month, day };
        } else {
            throw new Error('Formato de fecha no válido: ' + raw + '.');
        }
    }

    function parseTime(raw: string) {
        console.debug('parseTime', raw);
        let hour, minute;
        if (raw == null || raw === '') {
            return null;
        } else if (/^\d{1,2}$/.test(raw)) {
            // H(H)
            hour = Number.parseInt(raw);
            minute = 0;
        } else if (/^\d{3,4}$/.test(raw)) {
            // H(H)mm
            hour = Number.parseInt(raw.substring(0, raw.length - 2));
            minute = Number.parseInt(raw.substring(raw.length - 2));
        } else if (/^\d{1,2}[.:](\d{1,2})?$/.test(raw)) {
            // H(H).m(m), H(H):m(m), H(H)., H(H):
            const timeSpl = raw.split(/[.:]/);
            hour = Number.parseInt(timeSpl[0]);
            minute = timeSpl[1].length === 0 ? 0 : Number.parseInt(timeSpl[1]);
        } else if (/^[.:]\d{1,2}$/.test(raw)) {
            // .m(m), :m(m)
            const timeSpl = raw.split(/[.:]/);
            hour = new Date().getHours();
            minute = Number.parseInt(timeSpl[1]);
        }

        if (hour != null && minute != null) {
            if (hour > 23)
                throw new Error('Hora no válida: ' + hour + '.');
            if (minute > 59)
                throw new Error('Minuto no válido: ' + minute + '.');
            return { hour, minute };
        } else {
            throw new Error('Formato de hora no válido: ' + raw + '.');
        }
    }

    function parseUserDate(raw: string): string | null {
        raw = raw != null ? raw.trim() : '';
        console.debug('parseTime', raw);

        const now = DateTime.local();
        if (raw === '') {
            return required
                ? Utils.formatDateServer(now, true)
                : null;
        }

        let date, time;
        const rawSplt = raw.split(/\s+/);

        if (rawSplt.length === 1) {
            if (/^\.{1,2}$/.test(raw)) {
                // ., ..
                date = { year: now.year, month: now.month, day: now.day };
                time = raw.length === 1 ? null : { hour: now.hour, minute: now.minute };
            } else if (/^\d{12}$/.test(raw)) {
                // yyyyMMddHHmm
                date = parseDate(raw.substring(0, 8));
                time = parseTime(raw.substring(8));
            } else if (/^\d{10}$/.test(raw)) {
                // yyMMddHHmm
                date = parseDate(raw.substring(0, 6));
                time = parseTime(raw.substring(6));
            } else if (/^\d{3,4}|\d{1,2}[.:](\d{1,2})|[.:](\d{1,2})?$/.test(raw)) {
                // HHmm, Hmm, (H)H.(m)m, (H)H:(m)m, (H)H., (H)H:, .(m)m, :(m)m
                date = { year: now.year, month: now.month, day: now.day };
                time = parseTime(raw);
            } else /*if (/^\d{8}|\d{6}$/.test(raw))*/ {
                // other (date only
                date = parseDate(raw);
                time = null;
            }
        } else if (rawSplt.length === 2) {
            date = parseDate(rawSplt[0]);
            time = parseTime(rawSplt[1]);
        } else {
            throw new Error('Formato de fecha no válido: ' + raw + '.');
        }

        let ret: { datetime: DateTime | null, includeTime: boolean } = { datetime: null, includeTime: false };
        ret.datetime = DateTime.fromObject({
            year: date!.year,
            month: date!.month,
            day: date!.day
        });
        if (time != null) {
            ret.includeTime = true;
            ret.datetime = ret.datetime.set({
                hour: time.hour,
                minute: time.minute
            });
        } else {
            ret.includeTime = false;
            ret.datetime = ret.datetime.set({
                hour: 7,
                minute: 0
            });
        }

        if (!ret.datetime.isValid) {
            throw new Error('Fecha no válida: ' + raw + ' (' + ret.datetime.invalidReason + ').');
        }

        console.debug('parseTime -> ' + Utils.formatDateServer(ret.datetime));
        return Utils.formatDateServer(ret.datetime, ret.includeTime);
    }

    function handleInput(evt: any) {
        try {
            const parsed: string = parseUserDate(evt.target!.value);
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
            handleApply(true);
        } else if (evt.key === 'Escape') {
            handleCancel();
        }
    }

    function handleFocus() {
        focused = true;
        if (onfocus) onfocus();
        domInput.select();
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
        const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('dd/MM/yy');
        return str.replace(today, 'Hoy').replace(yesterday, 'Ayer').replace(tomorrow, 'Mañana');
    }
</script>

<input class="x-datetime-input date" class:valid={valid}
       placeholder={placeholder}
       bind:value={inputValue}
       bind:this={domInput}
       onfocus={handleFocus}
       oninput={handleInput}
       onblur={handleBlur}
       onkeydown={handleKeydown} />

<style lang="scss">

.x-datetime-input {
    font-weight: 500;
    font-size: 0.625rem;
    width: 90px;
    //temp
    display: inline-block !important;
    color: inherit;

    &:not(.valid) {
        background: #fdd;
        color: #a00;
    }
}

</style>