import { writable } from 'svelte/store';

function createCount() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        //increment: () => update((n) => n + 1),
        //decrement: () => update((n) => n - 1),
        //reset: () => set(0)
        set,
        update
    };
}

export const ztags = createCount();
