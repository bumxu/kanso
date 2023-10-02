import { Collection, Entity, Enum, JsonType, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';
import { JEntryEntity } from './JEntryEntity';

@Entity()
export class JEntity {

    // @Enum()
    // kind!: 'jira' | 'egipto' | 'user' | 'remedy' | 'itsm' | 'outlook

    /** Identificador único de la entidad. */
    @PrimaryKey()
    id!: number;

    /** Identificador único de la entidad en el sistema externo. */
    @Property()
    extId!: string;

    /** Otros identificadores para búsqueda. */
    @Property({ type: JsonType, nullable: true })
    othExtId?: string[];

    /** Metadatos de la entidad. */
    @Property({ type: JsonType, nullable: true })
    metadata?: any;

    // ---

    /** Entidades relacionadas con la entidad. */
    @OneToMany(() => JEntryEntity, ee => ee.entity)
    entities = new Collection<JEntryEntity>(this);

}