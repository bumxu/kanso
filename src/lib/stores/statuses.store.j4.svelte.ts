import type { StatusesSchema, StatusSchema } from '$lib/types/j4_types';
import type { RawStatusesSchema, RawStatusSchema } from '$lib/types/j4raw_types';

class StatusesStore {
    private _nid: bigint = 0n;
    private _data: StatusesSchema = $state({});

    public constructor() {
    }

    public get statuses(): StatusesSchema {
        return this._data;
    }

    public get(id: string): StatusSchema | null {
        return this.statuses[id] || null;
    }

    public add(status: Omit<StatusSchema, 'id'>): StatusSchema {
        const id = this._nid.toString(16);
        this._data[id] = { ...status, id };

        this._nid += 1n;
        return this._data[id];
    }

    public load(raw: RawStatusesSchema): void {
        this._nid = BigInt('0x' + raw.nid);
        this._data = raw.data.reduce((acc: StatusesSchema, status: RawStatusSchema) => {
            acc[status.id] = status;
            return acc;
        }, {});
    }

    public save(): RawStatusesSchema {
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

export const statusesStore = new StatusesStore();