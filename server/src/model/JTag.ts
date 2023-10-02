import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()
export class JTag {

    /** Identificador único de la etiqueta. */
    @PrimaryKey()
    id!: number;

    /** Nombre (texto) de la etiqueta. */
    @Property()
    name!: string;

    // ---

    /** Relación inversa con los registros. */
    @ManyToMany(() => JEntry, entry => entry.tags)
    entries = new Collection<JEntry>(this);

}