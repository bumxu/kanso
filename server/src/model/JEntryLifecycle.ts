import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()
export class JEntryLifecycle {

    @PrimaryKey()
    _id!: number;

    @ManyToOne()
    entry!: JEntry;

    @Property()
    state!: string;

    @Property()
    description!: string;

    @Property()
    createdAt: Date = new Date();

}