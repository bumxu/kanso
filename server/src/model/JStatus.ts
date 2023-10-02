import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()
export class JStatus {

    /** Identificador único del estado. */
    @PrimaryKey()
    id!: number;

    /** Nombre del estado. */
    @Property()
    name!: string;

    /** Indica si el estado es terminal. */
    @Property()
    isTerminal!: boolean;

    // ---

    /** Registros en un determinado estado. */
    @OneToMany(() => JEntry, entry => entry.status)
    entries = new Collection<JEntry>(this);

}