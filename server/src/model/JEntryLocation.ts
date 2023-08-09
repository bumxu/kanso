import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()
export class JEntryLocation {

    @PrimaryKey()
    _id!: number;

    @ManyToOne()
    entry!: JEntry;

    @Property()
    location!: string;

    @Property()
    entity!: string;

}