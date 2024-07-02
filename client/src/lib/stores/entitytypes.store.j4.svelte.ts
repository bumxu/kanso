import type { EntitySchema, EntityTypeSchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';

class EntityTypesStoreJ4Svelte {
    public entityTypes: { [id: string]: EntityTypeSchema } = $state({});

    public constructor() {
        this.add({
            id: 'eg:module', name: 'Módulo de Egipto',
            bgColor: '#fff2d5',
            displayFn: `(raw) => 'M' + raw.moduleId;`,
            parseFn: `(str) => {
                if (/^M\\d{3,7}$/.test(str)) {
                    return { moduleId: str.substring(1) };
                }
                return null;
            };`,
            lookupFn: `(str, raw) => {
                if (raw.moduleId != null){
                    if (/^M\\d+$/.test(str) ) {
                        if (str.substring(1) === raw.moduleId) {
                            return 100;
                        }
                        if (raw.moduleId.startsWith(str.substring(1))) {
                            return 10;
                        }
                    }
                    if (raw.moduleId.indexOf(str.substring(1)) > -1) {
                        return 1;
                    }
                }
                return 0;
            };`
        });
        this.add({
            id: 'eg:task', name: 'Tarea de Egipto',
            displayFn: `(raw) => 'T' + raw.taskId;`,
            parseFn: `(str) => {
                if (/^T\\d{3,7}$/.test(str)) {
                    return { taskId: str.substring(1) };
                }
                return null;
            };`,
            lookupFn: `(str, raw) => {
                if (raw.taskId != null && /^T\\d+$/.test(str) ) {
                    return str.substring(1) === raw.taskId ? 1 : 0;
                }
                return 0;
            };`
        });

        this.add({
            id: 'itsm:crq', name: 'CRQ',
            bgColor: '#eacfcf',
            displayFn: `(raw) => 'CRQ+' + raw.crqId;`,
            parseFn: `(str) => {
                if (/^CRQ\\d{4,20}$/.test(str)) {
                    return { crqId: str.substring(3) };
                }
                return null;
            };`,
            lookupFn: `(str, raw) => {
                if (raw.crqId != null && /^CRQ\\d+$/.test(str) ) {
                    return str.substring(3) === raw.crqId ? 1 : 0;
                }
                return 0;
            };`
        });

        // this.add({ id: nanoid(10), key: 'person' });
        // this.add({ id: nanoid(10), key: 'itsm:crq' });
        // this.add({ id: nanoid(10), key: 'remedy:incident' });
        // this.add({ id: nanoid(10), key: 'remedy:request' });
        // this.add({ id: nanoid(10), key: 'itsm:request' });
    }

    public add(entity: EntityTypeSchema): EntityTypeSchema {
        if (this.entityTypes[entity.id]) {
            throw new Error('Duplicate entity type id');
        }
        this.entityTypes[entity.id] = entity;
        return $state.snapshot(entity);
    }
}

export const entityTypesStore = new EntityTypesStoreJ4Svelte();