import { browser } from '$app/environment';
import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
import type { EntitiesSchema, EntitiesStoreSchema, EntitySchema, SuggestionsSchema } from '$lib/types/j4_types';
import type { RawEntitiesSchema, RawEntitySchema } from '$lib/types/j4raw_types';
import { nanoid } from 'nanoid';

class EntitiesStore {
    private _store: EntitiesStoreSchema = $state({ nid: 0n, data: {} });

    public constructor() {
        if (browser) {
            window['k'] = this;
        }
    }

    public get entities(): EntitiesSchema {
        return this._store.data;
    }

    public findById(entityId: string): EntitySchema | null {
        return this.entities[entityId] || null;
    }

    public getSuggestions(input: string): SuggestionsSchema<EntitySchema> {
        const matches: SuggestionsSchema<EntitySchema> = [];

        for (let entity of Object.values(this.entities)) {
            // if (entity.key.toLowerCase().indexOf(input.toLowerCase()) > -1) {
            //     matches.push($state.snapshot(entity));
            // }
            const type = entityTypesStore.entityTypes[entity.type];
            if (type != null) {
                const lookupFn = new Function('return ' + type.lookupFn)();
                //console.log('running ', parseFn, ' over ', input);
                const weight = lookupFn(input, entity.raw);
                if (weight != 0) {
                    matches.push({ item: $state.snapshot(entity), weight });
                }
            }
        }

        for (let type of Object.values(entityTypesStore.entityTypes)) {
            const parseFn = new Function('return ' + type.parseFn)();
            const result = parseFn(input);
            if (result != null) {
                matches.push({ item: { id: null, type: type.id, raw: result }, weight: -1 });
            }
        }

        return matches;
    }

    public add(entity: EntitySchema): EntitySchema {
        const id = this._store.nid.toString(16);
        entity.id = id;
        this._store.data[id] = entity;

        this._store.nid += 1n;

        return $state.snapshot(entity);
    }

    public clear(): void {
        this._store = { nid: 0n, data: {} };
    }

    public load(store: RawEntitiesSchema): void {
        this._store = {
            // hex -> bigint
            nid: BigInt('0x' + store.nid),
            // array -> map
            data: store.data.reduce((acc: EntitiesSchema, entity: RawEntitySchema) => {
                acc[entity.id] = entity;
                return acc;
            }, {})
        };
    }

    public save(): RawEntitiesSchema {
        return {
            // bigint -> hex
            nid: this._store.nid.toString(16),
            // map -> array
            data: Object.values(this._store.data)
        };
    }
}

export const entitiesStore = new EntitiesStore();