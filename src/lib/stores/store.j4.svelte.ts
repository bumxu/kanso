import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
import { journalStore } from '$lib/stores/journal.store.j4.svelte';
import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte';
import { statusesStore } from '$lib/stores/statuses.store.j4.svelte';
import { tagsStore } from '$lib/stores/tags.store.j4.svelte';

class J4Store {
    private fileHandle: FileSystemFileHandle | null = $state(null);
    public isFileHandled = $derived(this.fileHandle !== null);

    /** Clear all data from the stores in right order. */
    public clear(): void {
        journalStore.clear();
        entitiesStore.clear();
        entityTypesStore.clear();
        tagsStore.clear();
        statusesStore.clear();
        prioritiesStore.clear();
    }

    /** Load data from local storage into the stores in the right order. */
    public loadFromLS(): void {
        console.log('Loading data from local storage...');

        this.clear();
        entityTypesStore.load(JSON.parse(localStorage.getItem('j4entityTypes') || '{}'));
        entitiesStore.load(JSON.parse(localStorage.getItem('j4entities') || '{}'));
        tagsStore.load(JSON.parse(localStorage.getItem('j4tags') || '{}'));
        statusesStore.load(JSON.parse(localStorage.getItem('j4statuses') || '{}'));
        prioritiesStore.load(JSON.parse(localStorage.getItem('j4priorities') || '{}'));
        journalStore.load(JSON.parse(localStorage.getItem('j4journal') || '{}'));
    }

    /** Save data from the stores to local storage. */
    public saveToLS(): void {
        console.log('Saving data to local storage...');

        const raw = entitiesStore.save();
        localStorage.setItem('j4entityTypes', JSON.stringify(entityTypesStore.save()));
        localStorage.setItem('j4entities', JSON.stringify(raw));
        localStorage.setItem('j4tags', JSON.stringify(tagsStore.save()));
        localStorage.setItem('j4statuses', JSON.stringify(statusesStore.save()));
        localStorage.setItem('j4priorities', JSON.stringify(prioritiesStore.save()));
        localStorage.setItem('j4journal', JSON.stringify(journalStore.save()));
    }

    public async saveWithSSR() {
        // console.log('Saving data with SSR...');
        //
        // const file = this.save();
        //
        // await fetch('/api/save', {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         path: 'C:/Users/admin/OneDrive/j4dataSSR.json',
        //         data: file
        //     })
        // });

        //console.log(journalStore.save());
    }

    public async loadWithSSR() {
        // console.log('Loading data with SSR...');
        //
        // const file = await fetch('/api/load', {
        //     method: 'POST'
        //     //body: JSON.stringify({
        // });
        // const data = await file.json();
        // console.log('file ->', data);
        //
        // this.load(data);
    }

    private load(raw: any) {
        this.clear();
        entityTypesStore.load(raw.entityTypes);
        entitiesStore.load(raw.entities);
        tagsStore.load(raw.tags);
        statusesStore.load(raw.statuses);
        prioritiesStore.load(raw.priorities);
        journalStore.load(raw.journal);
    }

    private save() {
        return {
            entityTypes: entityTypesStore.save(),
            entities: entitiesStore.save(),
            tags: tagsStore.save(),
            statuses: statusesStore.save(),
            priorities: prioritiesStore.save(),
            journal: journalStore.save()
        };
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

    public async loadFromFile() {
        // console.log('Loading data from file...');
        // const data = JSON.parse(content);
        // entitiesStore.load(data.entities);
        // tagsStore.load(data.tags);
        // journalStore.load(data.journal);

        const options = {
            types: [{
                description: 'Kanso Journal File',
                accept: {
                    'application/json': ['.json']
                }
            }]
        };
        const handlers = await window.showOpenFilePicker(options);
        if (handlers === null || handlers.length === 0) {
            throw new Error('No file selected');
        }
        this.fileHandle = handlers[0];

        const raw = await (await this.fileHandle!.getFile()).text();
        this.load(JSON.parse(raw));
    }

    public async saveToFileHandler() {
        if (this.fileHandle !== null) {
            const raw = this.save();
            const writable = await this.fileHandle.createWritable();
            await writable.write(JSON.stringify(raw));
            await writable.close();
        }
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