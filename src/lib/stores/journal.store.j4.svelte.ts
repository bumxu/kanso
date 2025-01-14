import { isEmpty } from '$lib/helpers/runtime.helper';
import type { EntrySchema, EntryUpdateSchema } from '$lib/types/j4_types';
import type { RawEntriesSchema, RawEntrySchema } from '$lib/types/j4raw_types';

class JournalStore {
    private _nid: bigint = 0n;
    private _entryIndex: { [id: string]: EntrySchema } = $state({});

    public constructor() {
    }

    public get entries(): EntrySchema[] {
        return Object.values(this._entryIndex);
    }

    public get(id: string): EntrySchema | null {
        return this._entryIndex[id] || null;
    }

    public add(entry: Omit<EntrySchema, 'id'>): EntrySchema {
        const id = this._nid.toString(16);
        this._entryIndex[id] = { ...entry, id };

        this._nid += 1n;
        return this._entryIndex[id];
    }

    public del(id: string): void {
        delete this._entryIndex[id];
    }

    public getUpdate(entryId: string, updateId: string): EntryUpdateSchema | null {
        const entry = this._entryIndex[entryId];
        return entry?.updates.data.find(u => u.id === updateId) ?? null;
    }

    public addUpdate(entryId: string, update: Omit<EntryUpdateSchema, 'id'>, position: number = 0): EntryUpdateSchema {
        const entry = this._entryIndex[entryId];
        const id = BigInt('0x' + entry.updates.nid);
        entry.updates.data.splice(position, 0, {
            ...update,
            id: id.toString(16)
        });

        entry.updates.nid = (id + 1n).toString(16);
        return entry.updates.data[position];
    }

    public delUpdate(entryId: string, updateId: string): void {
        const entry = this._entryIndex[entryId];
        const index = entry.updates.data.findIndex(u => u.id === updateId);
        if (index >= 0) {
            entry.updates.data.splice(index, 1);
        }
    }

    public load(raw: RawEntriesSchema): void {
        this._nid = BigInt('0x' + raw.nid);
        const entryIndex: { [id: string]: EntrySchema } = {};
        for (const entry of raw.data) {
            // Campos array/objeto que pueden venir a null
            entry.entities = entry.entities || [];
            entry.tags = entry.tags || [];
            entry.updates = entry.updates || { nid: '0', data: [] };
            if (entry.updates.data == null) entry.updates.data = [];

            // Index
            entryIndex[entry.id] = entry;
        }
        this._entryIndex = entryIndex;
    }

    public save(): RawEntriesSchema {
        return {
            nid: this._nid.toString(16),
            data: Object.values($state.snapshot(this._entryIndex)).map((entry: RawEntrySchema) => ({
                // Optimizaciones
                id: entry.id,
                dateSince: entry.dateSince,
                ...(!isEmpty(entry.dateUpdated) ? { dateUpdated: entry.dateUpdated } : {}),
                ...(!isEmpty(entry.subject) ? { subject: entry.subject } : {}),
                ...(entry.updates?.data == null || entry.updates.data.length === 0 ? { updates: { nid: entry.updates.nid ?? 0 } } : { updates: entry.updates }),
                ...(entry.entities != null && entry.entities.length > 0 ? {
                    entities: entry.entities.map((entryEntity) => ({
                        id: entryEntity.id,
                        entityId: entryEntity.entityId,
                        ...(!isEmpty(entryEntity.note) ? { note: entryEntity.note } : {})
                    }))
                } : {}),
                ...(!isEmpty(entry.dateDue) ? { dateDue: entry.dateDue } : {}),
                ...(entry.tags != null && entry.tags.length > 0 ? { tags: entry.tags } : {}),
                ...(!isEmpty(entry.priority) ? { priority: entry.priority } : {}),
                ...(!isEmpty(entry.status) ? { status: entry.status } : {}),
                ...(!isEmpty(entry.dateClosed) ? { dateClosed: entry.dateClosed } : {})
            })).sort((a, b) => a.dateSince.localeCompare(b.dateSince))
        };
    }

    public clear(): void {
        this._nid = 0n;
        this._entryIndex = {};
    }
}

export const journalStore = new JournalStore();