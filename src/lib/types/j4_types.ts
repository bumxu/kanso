export type WindowsSchema = {
    [yyyymm: string]: WindowSchema
}

export type WindowSchema = {
    id: string;
    entries: EntrySchema[];
}

export type EntrySchema = {
    id: string;
    dateSince: string;
    dateUpdated?: string;
    subject: string;
    updates: EntryUpdatesSchema;
    entities: EntryEntitySchema[];
    tags: EntryTagsSchema;
    priority?: string;
    dateDue?: string;
    status?: string;
    dateClosed?: string;
}

export type EntryTagsSchema = string[];

export type EntryUpdatesSchema = {
    nid: string;
    data: EntryUpdateSchema[];
}
export type EntryUpdateSchema = {
    id: string;
    date?: string;
    body?: string;
}

export type EntryEntitySchema = {
    id: string;
    entityId: string;
    metadata: any;
}

// --- ENTITY TYPES
export type EntityTypesStoreSchema = {
    data: EntityTypesSchema
}
export type EntityTypesSchema = {
    [id: string]: EntityTypeSchema;
}
export type EntityTypeSchema = {
    id: string;
    name: string;
    color?: string;
    bgColor?: string;
    icon?: string;
    lookupFn: string;
    displayFn: string
    linkFn?: string;
    /**
     * A function that returns true if the given string syntax matches the entity type.
     * (str: string) => any | null
     */
    parseFn: string;
}

// --- ENTITIES
export type EntitiesSchema = {
    [entityId: string]: EntitySchema
}
export type EntitySchema = {
    id: string;
    type: string;
    raw: any;
    // metadata?: any;
}

// --- TAGS
export type TagsSchema = { [id: string]: TagSchema }
export type TagSchema = { id: string; name: string; priority?: number, bgColor?: string; color?: string }

// --- STATUS
export type StatusesSchema = { [id: string]: StatusSchema }
export type StatusSchema = { id: string, name: string, final: boolean, color?: string }

// --- PRIORITIES
export type PrioritiesSchema = { [id: string]: PrioritySchema }
export type PrioritySchema = { id: string, name: string }

// -- BASIC FILTERS
export type BasicFiltersSchema = BasicFilterSchema[];
export type BasicFilterSchema = {
    id: string;
    desc: string;
    filterFn: string;
    active: boolean;
}


export type Nil<T> = T | null | undefined;

export type SuggestionsSchema<T> = {
    item: T;
    displayName: string;
    weight: number;
}[];

export type ETypeDisplayFn = (id: string, raw: any) => string;
export type ETypeLinkFn = (entity: EntitySchema) => string;
