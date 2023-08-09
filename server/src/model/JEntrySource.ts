import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()

export class JEntrySource {

    @PrimaryKey()
    _id!: number;

    @ManyToOne()
    entry!: JEntry;

    @Property()
    source!: string;

    @Property()
    entity!: string;

}