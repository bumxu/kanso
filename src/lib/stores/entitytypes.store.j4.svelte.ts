import type { EntityTypeSchema, EntityTypesSchema, EntityTypesStoreSchema, ETypeDisplayFn } from '$lib/types/j4_types';

class EntityTypesStoreJ4Svelte {
    private _store: EntityTypesStoreSchema = $state({ data: {} });

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
        return this.entityTypes[entity.id];
    }

    public getDisplayFn(id: string): ETypeDisplayFn  ;
    public getDisplayFn(etype: EntityTypeSchema): ETypeDisplayFn  ;
    public getDisplayFn(arg: EntityTypeSchema | string): ETypeDisplayFn {
        const type = typeof arg === 'string' ? this.entityTypes[arg] : arg;
        const typeId = typeof arg === 'string' ? arg : type?.id;
        if (typeId == null) {
            // Id del tipo nulo
            return (id, raw) => 'Entity #' + id + ' (er:NLT)';
        }
        if (type == null) {
            // Tipo desconocido
            return (id, raw) => (typeId || '') + ':' + id + ' (er:UKT)';
        }
        if (type.displayFn == null || type.displayFn === '') {
            // No hay display function
            return (id, raw) => typeId + ':' + id + ' (er:NDP)';
        }
        const diplayfn = new Function('return ' + type.displayFn)();
        // Wrapper por si hay errores en al ejecutar la función
        return (id, raw) => {
            try {
                return diplayfn(id, raw);
            } catch (e) {
                console.warn('Error al ejecutar la displayFn del tipo de entidad "' + typeId + '" para la entidad "' + JSON.stringify(id) + '"', e);
                return typeId + ':' + id + ' (er:EXC)';
            }
        };
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