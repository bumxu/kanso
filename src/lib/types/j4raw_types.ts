// --- ENTRIES
export type RawEntriesSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawEntrySchema[];
}
export type RawEntrySchema = {
    id: string;
    dateSince: string;
    subject: string;
    updates: any[];
    entities?: any[];
    tags: string[];
    dateClosed?: string;
    dateDue?: string;
    status?: string;
    priority?: string;
}

// --- ENTITIES
export type RawEntitiesSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawEntitySchema[];
}
export type RawEntitySchema = {
    id: string;
    type: string;
    raw?: any;
}

// --- TAGS
export type RawTagsSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawTagSchema[];
}
export type RawTagSchema = {
    id: string;
    name: string;
}

// --- STATUS
export type RawStatusesSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawStatusSchema[];
}
export type RawStatusSchema = {
    id: string;
    name: string;
    final: boolean;
}

// --- PRIORITIES
export type RawPrioritiesSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawPrioritySchema[];
}
export type RawPrioritySchema = {
    id: string;
    name: string;
}

// --- BASIC FILTERS
export type RawBasicFiltersSchema = {
    /** Next id (hex). */
    nid: string;
    data: RawBasicFilterSchema[];
}
export type RawBasicFilterSchema = {
    id: string;
    desc: string;
    filterFn: string;
    active: boolean;
}