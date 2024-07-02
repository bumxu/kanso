import { zentities as entityStore } from '$lib/stores/j3_entities_store';
import type { EntityType } from '$lib/types/EntityType';
import { get } from 'svelte/store';

export class EntitiesService {
    private static instance: EntitiesService;

    private constructor() {
    }

    public static getInstance(): EntitiesService {
        if (!EntitiesService.instance) {
            EntitiesService.instance = new EntitiesService();
        }
        return EntitiesService.instance;
    }

    public getSuggestions(input: string): EntityType[] {
        const matches: EntityType[] = [];
        for (let entity of Object.values(get(entityStore)) as EntityType[]) {
            if (entity.extId.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                matches.push(entity);
            }
        }
        return matches;
    }
}