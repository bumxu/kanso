import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import type { EntitiesSchema, EntitySchema, SuggestionsSchema, TagSchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

class EntitiesStore {
    public entities: EntitiesSchema = $state({});

    public constructor() {
    }

    public findById(entityId: string): EntitySchema | null {
        return this.entities[entityId] || null;
    }

    public getSuggestions(input: string): EntitySchema[] {
        const matches: SuggestionsSchema<EntitySchema> = [];
        for (let entity of Object.values(this.entities)) {
            // if (entity.key.toLowerCase().indexOf(input.toLowerCase()) > -1) {
            //     matches.push($state.snapshot(entity));
            // }
            const type = entityTypesStore.entityTypes[entity.type];
            if (type != null) {
                const parseFn = new Function('return ' + type.lookupFn)();
                //console.log('running ', parseFn, ' over ', input);
                const parsed = parseFn(input, entity.raw);
                if (parsed != null) {
                    matches.push({ item: $state.snapshot(entity), weight: 1 });
                    console.log('found -> ', parsed);
                } else {
                   // console.log('not parsed');
                }
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
        // this.add({ id: '8uO4Q2aE-J', type: 'eg:module', raw: { moduleId: '025123' } });
        // this.add({ id: nanoid(10), type: 'person', raw: { username: 'vaa', fullname: 'Victor' } });
        // this.add({ id: nanoid(10), type: 'itsm:crq', raw: { crqId: '25012' } });
        // this.add({ id: nanoid(10), type: 'remedy:incident', raw: { incidentId: '251220' } });
        // this.add({ id: nanoid(10), type: 'remedy:request', raw: { requestId: '251220' } });
        // this.add({ id: nanoid(10), type: 'itsm:request', raw: { requestId: '251220' } });
        // this.add({ id: nanoid(10), type: 'eg:task', raw: { taskId: '025124' } });
        // this.add({ id: nanoid(10), type: 'eg:task', raw: { taskId: '025125' } });
        // this.add({ id: nanoid(10), type: 'eg:module', raw: { moduleId: '025126' } });
    }

    public clear(): void {
        this.entities = {};
    }
}

export const entitiesStore = new EntitiesStore();