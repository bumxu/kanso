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