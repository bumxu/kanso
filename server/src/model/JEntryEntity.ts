import { Collection, Entity, Enum, JsonType, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntity } from './JEntity';
import { JEntry } from './JEntry';

@Entity()
export class JEntryEntity {

    /** Identificador único del registro-entidad. */
    @PrimaryKey()
    id!: number;

    /** Metadatos de la entidad. */
    @Property({ type: JsonType, nullable: true })
    metadata?: any;

    // ---

    /** Relación inversa con los registros. */
    @ManyToOne({onDelete: 'cascade'})
    entry!: JEntry;

    /** Relación inversa con las entidades. */
    @ManyToOne({onDelete: 'restrict'})
    entity!: JEntity;
}