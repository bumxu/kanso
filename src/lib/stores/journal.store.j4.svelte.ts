import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import type { EntitiesSchema, EntitySchema, EntrySchema, WindowsSchema } from '$lib/types/j4_types';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

class JournalStore {
    public journal: WindowsSchema = $state({});
    //private _store: WindowsSchema = $state({});
    private _entryIndex: { [id: string]: EntitySchema } = {};
    private _entryTree: WindowsSchema = {};
    private nid: bigint = 0n;

    public constructor() {
        this.journal = {};

        // this.add({ dateSince: '20240601', subject: 'Entry A', updates: [{ id: '45fdrt432', date: '20240630', body: 'Revisado. Sin novedades.' }], tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        // this.add({ dateSince: '20240605', subject: 'Entry B', updates: [], tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        // this.add({ dateSince: '20240602', subject: 'Entry C', updates: [], tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
        // this.add({ dateSince: '20240603', subject: 'Entry D', updates: [], tags: [], dateClosed: '20240601', dateDue: '20240601', status: 'active' });
    }

    // public findById(entityId: string): EntitySchema | null {
    //     return this.entities[entityId] || null;
    // }
    //

    public add(entry: EntrySchema): EntrySchema {
        const id = this.nid.toString(16);
        this.nid += 1n;
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
        return $state.snapshot(entry);
    }

    public serialize(): void {
        console.log($state.snapshot(this.journal));
    }

    public load(raw: any): void {
        const entryIndex = {};
        const entryTree = {};
        for (const entry of raw.data) {
            // Index
            entryIndex[entry.id] = entry;

            // Tree
            const mo = entry.dateSince.substring(0, 6);
            if (entryTree[mo] == null) {
                entryTree[mo] = { id: mo, entries: [] };
            }
            entryTree[mo].entries.push(entry);
        }
        console.log('entryTree ->', entryTree);
        this._entryIndex = entryIndex;
        this._entryTree = entryTree;
        this.journal = entryTree;
    }

    public save(): WindowsSchema {
        return {
            nid: this.nid.toString(16),
            data: Object.values(this.journal).reduce((acc, window) => {
                acc.push(...window.entries);
                return acc;
            }, []).sort((a, b) => a.dateSince.localeCompare(b.dateSince))
        };
    }

    public clear(): void {
        //this.journal = {};
    }
}

export const journalStore = new JournalStore();