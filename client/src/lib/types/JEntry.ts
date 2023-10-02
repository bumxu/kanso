export interface JEntry {
    id?: string;
    createdAt: string;
    createdAtShowsTime?: boolean;
    topic: string;
    updatedAt?: string;
    updatedAtShowsTime?: boolean;
    closedAt?: string;
    updates: [];
    entities: [];
}