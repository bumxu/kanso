import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntry } from './JEntry';

@Entity()
export class JEntryUpdate {

    /** Identificador único de la actualización. */
    @PrimaryKey()
    id!: number;

    /** Descripción de la actualización. */
    @Property()
    body!: string;

    /** Fecha asociada a la actualización. */
    @Property()
    date: Date = new Date();

    // ---

    /** Relación inversa con los registros. */
    @ManyToOne({onDelete: 'cascade'})
    entry!: JEntry;

    public update(json: any) {
        if (json.body !== undefined)
            this.body = json.body;
        if (json.date !== undefined)
            this.date = new Date(json.date);
    }
}