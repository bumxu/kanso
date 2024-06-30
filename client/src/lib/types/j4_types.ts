export type WindowsSchema = {
    [yyyymm: string]: WindowSchema
}

export type WindowSchema = {
    id: string;
    entries: EntrySchema[];
}

export type EntrySchema = {
    id?: string;
    dateCreated: string;
    dateSince: string;
    subject: string;
    entities?: EntryEntitySchema[];
    tags: TagsSchema;
    dateClosed?: string;
    dateDue?: string;
    status: string;
}

export type EntryEntitySchema = {
    id: string;
    entityId: string;
    metadata: any;
}

export type EntitySchema = {
    id: string;
    key: string;
    type: string;
    detail?: string;
    metadata?: any;
}

export type EntitiesSchema = {
    [entityId: string]: EntitySchema
}

export type TagsSchema = string[];

export type Nil<T> = T | null | undefined;