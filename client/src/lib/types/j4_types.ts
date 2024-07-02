export type WindowsSchema = {
    [yyyymm: string]: WindowSchema
}

export type WindowSchema = {
    id: string;
    entries: EntrySchema[];
}

export type EntrySchema = {
    id?: string;
    dateSince: string;
    subject: string;
    updates: EntreUpdateSchema[];
    entities?: EntryEntitySchema[];
    tags: EntryTagsSchema;
    dateClosed?: string;
    dateDue?: string;
    status: string;
}

export type EntryTagsSchema = string[];

export type EntreUpdateSchema = {
    id?: string;
    date?: string;
    body: string;
}

export type EntryEntitySchema = {
    id: string;
    entityId: string;
    metadata: any;
}

export type EntityTypeSchema = {
    id: string;
    name: string;
    color?: string;
    bgColor?: string;
    lookupFn: string;
    displayFn: string
    /**
     * A function that returns true if the given string syntax matches the entity type.
     * (str: string) => any | null
     */
    parseFn: string;
}

export type EntityTypesSchema = {
    [id: string]: EntityTypeSchema;
}

export type EntitySchema = {
    id: string;
    type: string;
    raw?: any;
    metadata?: any;
}

export type EntitiesSchema = {
    [entityId: string]: EntitySchema
}

export type TagSchema = {
    name: string;
}

export type StatusSchema = {
    id: string,
    name: string
}

export type StatusesSchema = StatusSchema[];

export type Nil<T> = T | null | undefined;