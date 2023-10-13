export interface JEntry {
    id: number;
    createdAt: string;
    createdAtShowsTime: boolean;
    topic: string;
    priority?: number | null;
    closedAt?: string | null;
    closedAtShowsTime: boolean;
    updates: [];
    entities: [];
    tags: [];
}