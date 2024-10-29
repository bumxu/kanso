import type { EntityTypeSchema, EntityTypesSchema, EntityTypesStoreSchema, ETypeDisplayFn } from '$lib/types/j4_types';

class EntityTypesStoreJ4Svelte {
    private _store: EntityTypesStoreSchema = $state({ data: {} });

    public constructor() {
        // this.add({
        //     id: 'eg:module', name: 'Módulo de Egipto',
        //     bgColor: '#fff2d5',
        //     displayFn: `(raw) => 'M' + raw.moduleId;`,
        //     parseFn: `(str) => {
        //         if (/^M\\d{3,7}$/.test(str)) {
        //             return { moduleId: str.substring(1) };
        //         }
        //         return null;
        //     };`,
        //     lookupFn: `(str, raw) => {
        //         if (raw.moduleId != null){
        //             if (/^M\\d+$/.test(str) ) {
        //                 if (str.substring(1) === raw.moduleId) {
        //                     return 100;
        //                 }
        //                 if (raw.moduleId.startsWith(str.substring(1))) {
        //                     return 10;
        //                 }
        //             }
        //             if (raw.moduleId.indexOf(str.substring(1)) > -1) {
        //                 return 1;
        //             }
        //         }
        //         return 0;
        //     };`
        // });
        // this.add({
        //     id: 'eg:task', name: 'Tarea de Egipto',
        //     displayFn: `(raw) => 'T' + raw.taskId;`,
        //     parseFn: `(str) => {
        //         if (/^T\\d{3,7}$/.test(str)) {
        //             return { taskId: str.substring(1) };
        //         }
        //         return null;
        //     };`,
        //     lookupFn: `(str, raw) => {
        //         if (raw.taskId != null && /^T\\d+$/.test(str) ) {
        //             return str.substring(1) === raw.taskId ? 1 : 0;
        //         }
        //         return 0;
        //     };`
        // });
        //
        // this.add({
        //     id: 'itsm:crq', name: 'CRQ',
        //     bgColor: '#eacfcf',
        //     displayFn: `(raw) => 'CRQ+' + raw.crqId;`,
        //     parseFn: `(str) => {
        //         if (/^CRQ\\d{4,20}$/.test(str)) {
        //             return { crqId: str.substring(3) };
        //         }
        //         return null;
        //     };`,
        //     lookupFn: `(str, raw) => {
        //         if (raw.crqId != null && /^CRQ\\d+$/.test(str) ) {
        //             return str.substring(3) === raw.crqId ? 1 : 0;
        //         }
        //         return 0;
        //     };`
        // });
        //
        // this.add({
        //     id: 'user', name: 'Persona',
        //     bgColor: '#90b9d5',
        //     displayFn: `(raw) => raw.fullname != null ? raw.fullname : '@' + raw.username;`,
        //     parseFn: `(str) => {
        //         if (/^@\\[a-z]{3}\\d{5}$/.test(str)) {
        //             return { username: str.substring(3) };
        //         }
        //         return null;
        //     };`,
        //     lookupFn: `(str, raw) => {
        //         if (raw.username != null && /^@\\[a-z]{3}\\d{5}$/.test(str) ) {
        //             return str.substring(1) === raw.username ? 1 : 0;
        //         }
        //         return 0;
        //     };`
        // });

    }

    public get entityTypes(): EntityTypesSchema {
        return this._store.data;
    }

    public exists(id: string): boolean {
        return this.get(id) != null;
    }

    public get(id: string): EntityTypeSchema | null {
        return this.entityTypes[id] || null;
    }

    public add(entity: EntityTypeSchema): EntityTypeSchema {
        if (entity.id == null) {
            throw new Error('The entity type id is required.');
        }
        if (this.entityTypes[entity.id] != null) {
            throw new Error(`The given id already exists for the entity type ${this.entityTypes[entity.id].name}.`);
        }
        this.entityTypes[entity.id] = entity;
        return $state.snapshot(entity);
    }

    public getDisplayFn(id: string): ETypeDisplayFn | null ;
    public getDisplayFn(etype: EntityTypeSchema): ETypeDisplayFn | null ;
    public getDisplayFn(arg: EntityTypeSchema | string): ETypeDisplayFn | null {
        const type = typeof arg === 'string' ? this.entityTypes[arg] : arg;
        const typeId = typeof arg === 'string' ? arg : arg.id;
        if (type == null) {
            // Tipo desconocido
            return (id, raw) => typeId + ':' + id + ' (er:UKT)';
        }
        if (type.displayFn == null || type.displayFn === '') {
            // No hay display function
            return (id, raw) => typeId + ':' + id + ' (er:NDP)';
        }
        return new Function('return ' + type.displayFn)();
    }

    public clear(): void {
        this._store = { data: {} };
    }

    public load(store: EntityTypesStoreSchema): void {
        this._store = {
            data: store.data
        };
    }

    public save(): EntityTypesStoreSchema {
        return {
            data: this._store.data
        };
    }
}

export const entityTypesStore = new EntityTypesStoreJ4Svelte();