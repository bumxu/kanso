import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import type { EntitiesSchema, EntitySchema, EntrySchema, WindowsSchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

class JournalStore {
    public journal: WindowsSchema = $state({});

    public constructor() {
        this.journal = {};

        this.add({ dateCreated: '20240601', dateSince: '20240601', subject: 'Entry A', tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        this.add({ dateCreated: '20240601', dateSince: '20240605', subject: 'Entry B', tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        this.add({ dateCreated: '20240601', dateSince: '20240602', subject: 'Entry C', tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        this.add({ dateCreated: '20240601', dateSince: '20240603', subject: 'Entry D', tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        // this.add({ id: nanoid(10), key: 'M025123', type: 'egipto:module' });
        // this.add({ id: nanoid(10), key: '.Victor', type: 'person' });
        // this.add({ id: nanoid(10), key: 'CRQ25012', type: 'itsm:crq' });
        // this.add({ id: nanoid(10), key: 'R251220', type: 'remedy:incident' });
        // this.add({ id: nanoid(10), key: 'PR 251220', type: 'remedy:request' });
        // this.add({ id: nanoid(10), key: 'P 251220', type: 'itsm:request' });
        // this.add({ id: nanoid(10), key: 'M025124', type: 'egipto:module' });
        // this.add({ id: nanoid(10), key: 'M025125', type: 'egipto:module' });
        // this.add({ id: nanoid(10), key: 'M025126', type: 'egipto:module' });
    }

    // public findById(entityId: string): EntitySchema | null {
    //     return this.entities[entityId] || null;
    // }
    //

    public add(entry: EntrySchema): EntrySchema {
        const id = nanoid(10);
        const dateSince = entry.dateSince;
        const windowId = dateSince.substring(0, 6);
        if (this.journal[windowId] == null) {
            this.journal[windowId] = {
                id: windowId,
                entries: []
            };
        }
        entry.id = id;
        this.journal[windowId].entries.push(entry);
        this.journal[windowId].entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
        this.journal[windowId].entries = this.journal[windowId].entries;
        return $state.snapshot(entry);
    }

    public serialize(): void {
        console.log($state.snapshot(this.journal));
    }

    public load(data: WindowsSchema): void {
        this.journal = data;
    }

    public clear(): void {
        this.journal = {};
    }
}

export const journalStore = new JournalStore();