import { journalStore } from '$lib/stores/journal.store.j4.svelte';
import type { SuggestionsSchema, TagSchema, TagsSchema } from '$lib/types/j4_types';
import type { RawTagSchema, RawTagsSchema } from '$lib/types/j4raw_types';
import { nanoid } from 'nanoid';

class TagsStore {
    private _nid: bigint = 0n;
    private _data: TagsSchema = $state({});

    public constructor() {
    }

    public get tags(): TagsSchema {
        return this._data;
    }

    public getById(id: string): TagSchema | null {
        return this.tags[id] || null;
    }

    public getByName(name: string): TagSchema | null {
        const fnd = Object.values(this.tags).filter((tag) => tag.name === name);
        return fnd.length > 0 ? fnd[0] : null;
    }

    public getSuggestions(input: string): SuggestionsSchema<TagSchema> {
        const matches: SuggestionsSchema<TagSchema> = [];
        for (let tag of Object.values(this.tags)) {
            const iof = tag.name.toLowerCase().indexOf(input.toLowerCase());
            if (iof === 0) {
                matches.push({ item: tag, weight: 10 });
            } else if (iof > -1) {
                matches.push({ item: tag, weight: 1 });
            }
        }
        matches.sort((a, b) => b.weight - a.weight);
        return matches;
    }

    public add(tag: Omit<TagSchema, 'id'>): TagSchema {
        tag.id = this._nid.toString(16);
        if (this.getByName(tag.name) != null) {
            throw new Error(`Tag with name ${tag.name} already exists`);
        }
        this.tags[tag.id] = tag;

        this._nid += 1n;
        return this.tags[tag.id];
    }

    public delete(id: string): void {
        // Count
        let count = 0;
        Object.values(journalStore.journal).forEach((window) => {
            window.entries.forEach((entry) => {
                if (entry.tags.includes(id)) {
                    count++;
                }
            });
        });

        if (count > 0) {
            if (confirm('La etiqueta se usa en ' + count + ' entradas, se quitará. ¿Desea continuar?')) {
                Object.values(journalStore.journal).forEach((window) => {
                    window.entries.forEach((entry) => {
                        entry.tags = entry.tags.filter((tagId) => tagId !== id);
                    });
                });
                delete this.tags[id];
            }
        } else {
            delete this.tags[id];
        }
    }

    public load(raw: RawTagsSchema): void {
        this._nid = BigInt('0x' + raw.nid);
        this._data = raw.data.reduce((acc: TagsSchema, tag: RawTagSchema) => {
            acc[tag.id] = tag;
            return acc;
        }, {});
    }

    public save(): RawTagsSchema {
        return {
            // bigint -> hex
            nid: this._nid.toString(16),
            // map -> array
            data: Object.values(this._data)
        };
    }

    public clear(): void {
        this._nid = 0n;
        this._data = {};
    }
}

export const tagsStore = new TagsStore();