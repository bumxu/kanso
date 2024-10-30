import type { EntrySchema, WindowsSchema } from '$lib/types/j4_types';
import type { RawEntriesSchema, RawEntrySchema } from '$lib/types/j4raw_types';

class JournalStore {
    private _nid: bigint = 0n;
    private _entryIndex: { [id: string]: EntrySchema } = $state({});
    private _entryTree: WindowsSchema = {};
    public journal: WindowsSchema = $state({});
    //private _store: WindowsSchema = $state({});

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

    public get(id: string): EntrySchema | null {
        return this._entryIndex[id] || null;
    }

    public add(entry: EntrySchema): EntrySchema {
        const id = this._nid.toString(16);
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

        this._nid += 1n;
        return this.journal[windowId].entries.find((e) => e.id === id) as EntrySchema;
    }

    public load(raw: RawEntriesSchema): void {
        this._nid = BigInt('0x' + raw.nid);
        const entryIndex: { [id: string]: EntrySchema } = {};
        const entryTree: WindowsSchema = {};
        for (const entry of raw.data) {
            // Campos array/objeto que pueden venir a null
            entry.entities = entry.entities || [];
            entry.tags = entry.tags || [];
            entry.updates = entry.updates || [];

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
        // this._entryTree = entryTree;
        this.journal = entryTree;
    }

    public save(): RawEntriesSchema {
        return {
            nid: this._nid.toString(16),
            data: Object.values(this.journal).reduce((acc: RawEntrySchema[], window) => {
                acc.push(...window.entries);
                return acc;
            }, []).sort((a, b) => a.dateSince.localeCompare(b.dateSince))
        };
    }

    public clear(): void {
        this._nid = 0n;
        this._entryIndex = {};
        this._entryTree = {};
        this.journal = {};
    }
}

export const journalStore = new JournalStore();