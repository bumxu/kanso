import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntryLifecycle } from './JEntryLifecycle';
import { JEntryLocation } from './JEntryLocation';
import { JEntrySource } from './JEntrySource';

@Entity()
export class JEntry {

    @PrimaryKey()
    _id!: number;

    @Property()
    createdAt: Date = new Date();

    @Property()
    topic!: string;

    @Property({onUpdate: () => new Date()})
    updatedAt: Date = new Date();

    @OneToMany(() => JEntryLifecycle, lifecycle => lifecycle.entry)
    lifecycle = new Collection<JEntryLifecycle>(this);

    @OneToMany(() => JEntryLocation, location => location.entry)
    locations = new Collection<JEntryLocation>(this);

    @OneToMany(() => JEntrySource, source => source.entry)
    source = new Collection<JEntrySource>(this);

    @Property()
    closed = false;

    @Property()
    closedAt?: Date;

}