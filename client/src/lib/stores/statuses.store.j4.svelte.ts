import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import type { EntitiesSchema, EntitySchema, StatusSchema, StatusesSchema, TagsSchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';
import { get } from 'svelte/store';

class StatusesStore {
    public statuses: StatusesSchema = $state([]);

    public constructor() {
        this.add({ id: 'active', name: 'Activo' });
        this.add({ id: 'overflow', name: 'Desbordado' });
        this.add({ id: 'closed-ok', name: 'Cerrado :)' });
        this.add({ id: 'closed-meh', name: 'Cerrado :|' });
        this.add({ id: 'closed-bad', name: 'Cerrado :(' });
    }

    public add(status: StatusSchema): StatusSchema {
        this.statuses.push(status);
        return $state.snapshot(status);
    }

    public load(data: StatusesSchema): void {
        this.statuses = data;
    }

    public clear(): void {
        this.statuses = [];
    }
}

export const statusesStore = new StatusesStore();