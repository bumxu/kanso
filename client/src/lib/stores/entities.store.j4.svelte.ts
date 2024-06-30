import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import type { EntitiesSchema, EntitySchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

class EntitiesStore {
    public entities: EntitiesSchema = $state({});

    public constructor() {
        this.add({ id: nanoid(10), key: 'M025123', type: 'egipto:module' });
        this.add({ id: nanoid(10), key: '.Victor', type: 'person' });
        this.add({ id: nanoid(10), key: 'CRQ25012', type: 'itsm:crq' });
        this.add({ id: nanoid(10), key: 'R251220', type: 'remedy:incident' });
        this.add({ id: nanoid(10), key: 'PR 251220', type: 'remedy:request' });
        this.add({ id: nanoid(10), key: 'P 251220', type: 'itsm:request' });
        this.add({ id: nanoid(10), key: 'M025124', type: 'egipto:module' });
        this.add({ id: nanoid(10), key: 'M025125', type: 'egipto:module' });
        this.add({ id: nanoid(10), key: 'M025126', type: 'egipto:module' });
    }

    public findById(entityId: string): EntitySchema | null {
        return this.entities[entityId] || null;
    }

    public getSuggestions(input: string): EntitySchema[] {
        const matches: EntitySchema[] = [];
        for (let entity of Object.values(this.entities)) {
            if (entity.key.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                matches.push($state.snapshot(entity));
            }
        }
        return matches;
    }

    public add(entity: EntitySchema): EntitySchema {
        const id = nanoid(10);
        if (this.entities[id]) {
            throw new Error('Duplicate entity id');
        }
        entity.id = id;
        this.entities[id] = entity;
        return $state.snapshot(entity);
    }

    public load(data: EntitiesSchema): void {
        this.entities = data;
    }

    public clear(): void {
        this.entities = {};
    }
}

export const entitiesStore = new EntitiesStore();