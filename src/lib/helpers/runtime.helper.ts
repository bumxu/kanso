import { browser } from '$app/environment';
import type { Nil } from '$lib/types/j4_types';

export function includes(a: Nil<string>, b: Nil<string>): boolean {
    if (a == null || b == null) {
        return false;
    }
    return a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
        b.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
}

export function indexOf(a: string, b: string): number {
    return a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(
        b.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
}

export function compare(a: string, b: string): number {
    return a.localeCompare(b);
}

export function equals(a: string, b: string): boolean {
    return a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === b.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function match(a: string, regexp: string | RegExp): boolean {
    const norm = a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return regexp instanceof RegExp ? regexp.test(norm) : new RegExp(regexp, '').test(norm);
}

if (browser && !window['kx']) {
    window['kx'] = { includes, indexOf, compare, equals, match };
}