import type { BasicFilterSchema, BasicFiltersSchema } from '$lib/types/j4_types';
import type { RawBasicFiltersSchema } from '$lib/types/j4raw_types';

class BasicFiltersStore {
    private _nid: bigint = 0n;
    private _data: BasicFiltersSchema = $state([]);

    public constructor() {
    }

    public get filters(): BasicFiltersSchema {
        return this._data;
    }

    public add(filter: Omit<BasicFilterSchema, 'id'>): BasicFilterSchema {
        const id = this._nid.toString(16);
        this._data.push({ ...filter, id });

        this._nid += 1n;
        return this._data[this._data.length - 1];
    }

    // public delete(id: string): void {
    //     // Count
    //     let count = 0;
    //     Object.values(journalStore.journal).forEach((window) => {
    //         window.entries.forEach((entry) => {
    //             if (entry.tags.includes(id)) {
    //                 count++;
    //             }
    //         });
    //     });
    //
    //     if (count > 0) {
    //         if (confirm('La etiqueta se usa en ' + count + ' entradas, se quitará. ¿Desea continuar?')) {
    //             Object.values(journalStore.journal).forEach((window) => {
    //                 window.entries.forEach((entry) => {
    //                     entry.tags = entry.tags.filter((tagId) => tagId !== id);
    //                 });
    //             });
    //             delete this.tags[id];
    //         }
    //     } else {
    //         delete this.tags[id];
    //     }
    // }

    public load(raw?: Partial<RawBasicFiltersSchema>): void {
        this.clear();
        if (raw != null) {
            if (raw.nid == null && raw.data != null && raw.data.length > 0) {
                throw new Error('La lista de filtros cargada no contiene la propiedad requerida "nid".');
            }
            this._nid = BigInt('0x' + (raw.nid ?? 0));
            this._data = raw.data ?? [];
        }
    }

    public save(): RawBasicFiltersSchema {
        return {
            // bigint -> hex
            nid: this._nid.toString(16),
            // map -> array
            data: this._data
        };
    }

    public clear(): void {
        this._nid = 0n;
        this._data = [];
    }
}

export const filtersStore = new BasicFiltersStore();