import type { PrioritiesSchema, PrioritySchema } from '$lib/types/j4_types';
import type { RawPrioritiesSchema, RawPrioritySchema } from '$lib/types/j4raw_types';

class PrioritiesStore {
    private _nid: bigint = 0n;
    private _data: PrioritiesSchema = $state({});

    public constructor() {
    }

    public get priorities(): PrioritiesSchema {
        return this._data;
    }

    public add(status: Omit<PrioritySchema, 'id'>): PrioritySchema {
        const id = this._nid.toString(16);
        this._data[id] = { ...status, id };

        this._nid += 1n;
        return this._data[id];
    }

    public load(raw: RawPrioritiesSchema): void {
        this._nid = BigInt('0x' + raw.nid);
        this._data = raw.data.reduce((acc: PrioritiesSchema, status: RawPrioritySchema) => {
            acc[status.id] = status;
            return acc;
        }, {});
    }

    public save(): RawPrioritiesSchema {
        return {
            // bigint -> hex
            nid: this._nid.toString(16),
            // map -> array
            data: Object.values(this._data)
        };
    }

    public clear(): void {
        this._nid = 0n;
        this._data = {};
    }
}

export const prioritiesStore = new PrioritiesStore();