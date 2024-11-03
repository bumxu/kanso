import { Utils } from '$lib/Utils';
import { DateTime } from 'luxon';
import type { Action } from 'svelte/action';
import tippy from 'tippy.js';

type Props = {}

export class DateTimeHelper {
    private static readonly required = false;

    private static parseDate(raw: string): { year: number, month: number, day: number } | null {
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

    private static parseTime(raw: string): { hour: number, minute: number } | null {
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

    public static parseUserDate(raw: string): string | null {
        raw = raw != null ? raw.trim() : '';
        console.debug('parseTime', raw);

        const now = DateTime.local();
        if (raw === '') {
            return this.required
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
                date = this.parseDate(raw.substring(0, 8));
                time = this.parseTime(raw.substring(8));
            } else if (/^\d{10}$/.test(raw)) {
                // yyMMddHHmm
                date = this.parseDate(raw.substring(0, 6));
                time = this.parseTime(raw.substring(6));
            } else if (/^\d{3,4}|\d{1,2}[.:](\d{1,2})|[.:](\d{1,2})?$/.test(raw)) {
                // HHmm, Hmm, (H)H.(m)m, (H)H:(m)m, (H)H., (H)H:, .(m)m, :(m)m
                date = { year: now.year, month: now.month, day: now.day };
                time = this.parseTime(raw);
            } else /*if (/^\d{8}|\d{6}$/.test(raw))*/ {
                // other (date only
                date = this.parseDate(raw);
                time = null;
            }
        } else if (rawSplt.length === 2) {
            date = this.parseDate(rawSplt[0]);
            time = this.parseTime(rawSplt[1]);
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

}
