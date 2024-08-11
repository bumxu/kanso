import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
import { journalStore } from '$lib/stores/journal.store.j4.svelte';
import { tagsStore } from '$lib/stores/tags.store.j4.svelte';

class J4Store {
    private fileHandle: FileSystemFileHandle | null = $state(null);

    public isFileHandled = $derived(this.fileHandle !== null);

    /** Clear all data from the stores in right order. */
    public clear(): void {
        journalStore.clear();
        entitiesStore.clear();
        tagsStore.clear();
    }

    /** Load data from local storage into the stores in the right order. */
    public loadToLS(): void {
        console.log('Loading data from local storage...');

        this.clear();

        const entities = JSON.parse(localStorage.getItem('j4entities') ?? '{}');
        console.debug('entities ->', entities);
        entitiesStore.load(entities);

        const tags = JSON.parse(localStorage.getItem('j4tags') ?? '{}');
        console.debug('tags ->', tags);
        tagsStore.load(tags);

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

        const tags = JSON.stringify(tagsStore.tags);
        console.debug('tags ->', tags);
        localStorage.setItem('j4tags', tags);

        const journal = JSON.stringify(journalStore.journal);
        console.debug('journal ->', journal);
        localStorage.setItem('j4journal', journal);
    }

    public async saveWithSSR() {
        console.log('Saving data with SSR...');

        const file = {
            entities: entitiesStore.entities,
            tags: tagsStore.tags,
            journal: journalStore.journal
        };

        await fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify({
                path: 'C:/Users/admin/OneDrive/j4data.json',
                data: file
            })
        });
    }

    public async loadWithSSR() {
        console.log('Loading data with SSR...');

        const file = await fetch('/api/load', {
            method: 'POST'
            //body: JSON.stringify({
        });
    }

    public saveToDownload() {
        console.log('Saving data to download...');
        const entities = JSON.stringify(entitiesStore.entities);
        const tags = JSON.stringify(tagsStore.tags);
        const journal = JSON.stringify(journalStore.journal);
        const blob = new Blob([entities, tags, journal], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'j4data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    public async loadFromFile(content: string) {
        // console.log('Loading data from file...');
        // const data = JSON.parse(content);
        // entitiesStore.load(data.entities);
        // tagsStore.load(data.tags);
        // journalStore.load(data.journal);

        const options = {
            types: [{
                description: 'Jornal4 Raw Data File',
                accept: {
                    'application/json': ['.json']
                }
            }]
        };
        const handle = await window.showSaveFilePicker(options);
        if (handle === null) {
            throw new Error('No file selected');
        }
        this.fileHandle = handle;
    }

    public saveToFile() {
        console.log('Saving data to file...');
        const entities = JSON.stringify(entitiesStore.entities);
        const tags = JSON.stringify(tagsStore.tags);
        const journal = JSON.stringify(journalStore.journal);
        const blob = new Blob([entities, tags, journal], { type: 'application/json' });
        this.fileHandle?.createWritable().then((writable) => {
            writable.write(blob);
            writable.close();
        });
    }
}

export const storeManager = new J4Store();