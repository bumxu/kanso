export interface IJournalEntry {
    id: number;
    createdAt: Date;
    createdAtShowsTime: boolean;
    parent?: IJournalEntry;
}