import type { SuggestionsSchema, TagSchema, TagsSchema } from '$lib/types/j4_types';
import { nanoid } from 'nanoid';

class TagsStore {
    public tags: TagsSchema = $state({});

    public constructor() {
        // this.add({ id: '00001', name: 'prueba1' });
        // this.add({ id: '00002', name: 'prueba2' });
        // this.add({ id: '00003', name: 'prueba3' });
        // this.add({ id: '00004', name: 'prueba4' });
        // this.add({ id: '00005', name: 'prueba5' });
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

    public add(tag: TagSchema): TagSchema {
        if (tag.id == null) {
            tag.id = nanoid(10);
        }
        if (this.tags[tag.id] != null) {
            throw new Error(`Tag with id ${tag.id} already exists`);
        }
        if (this.getByName(tag.name) != null) {
            throw new Error(`Tag with name ${tag.name} already exists`);
        }
        this.tags[tag.id] = tag;
        return tag;
    }

    public load(data: TagsSchema): void {
        this.tags = data;
    }

    public clear(): void {
        this.tags = {};
    }
}

export const tagsStore = new TagsStore();