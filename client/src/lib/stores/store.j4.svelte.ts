import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
import { journalStore } from '$lib/stores/journal.store.j4.svelte';

class J4Store {

    /** Clear all data from the stores in right order. */
    public clear(): void {
        journalStore.clear();
        entitiesStore.clear();
    }

    /** Load data from local storage into the stores in the right order. */
    public loadToLS(): void {
        console.log('Loading data from local storage...');

        this.clear();

        const entities = JSON.parse(localStorage.getItem('j4entities') ?? '{}');
        console.debug('entities ->', entities);
        entitiesStore.load(entities);

        const journal = JSON.parse(localStorage.getItem('j4journal') ?? '{}');
        console.debug('journal ->', journal);
        journalStore.load(journal);
    }

    /** Save data from the stores to local storage. */
    public saveToLS(): void {
        console.log('Saving data to local storage...');

        const entities = JSON.stringify(entitiesStore.entities);
        console.debug('entities ->', entities);
        localStorage.setItem('j4entities', entities);

        const journal = JSON.stringify(journalStore.journal);
        console.debug('journal ->', journal);
        localStorage.setItem('j4journal', journal);
    }


}

export const storeManager = new J4Store();