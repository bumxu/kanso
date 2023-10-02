import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { JEntryEntity } from './JEntryEntity';
import { JEntryUpdate } from './JEntryUpdate';
import { JStatus } from './JStatus';
import { JTag } from './JTag';

@Entity()
export class JEntry {

    /** Identificador único del registro. */
    @PrimaryKey()
    id!: number;

    /** Fecha de alta del registro. */
    @Property()
    createdAt: Date = new Date();
    /** Precisión de la fecha de alta del registro. */
    @Property()
    createdAtShowsTime: boolean = true;

    /** Registro padre. */
    @ManyToOne()
    parent?: JEntry;

    /** Asunto del registro. */
    @Property()
    topic!: string;

    /** Actualizaciones del registro. */
    @OneToMany(() => JEntryUpdate, update => update.entry)
    updates = new Collection<JEntryUpdate>(this);

    /** Entidades relacionadas con el registro. */
    @OneToMany(() => JEntryEntity, ee => ee.entry)
    entities = new Collection<JEntryEntity>(this);

    /** Etiquetas del registro. */
    @ManyToMany(() => JTag, 'entries', {owner: true})
    tags = new Collection<JTag>(this);

    /** Estado del registro. */
    @ManyToOne({nullable: true})
    status?: JStatus;

    /** Fecha de cierre o completado del registro. */
    @Property()
    closedAt?: Date;
    /** Precisión de la fecha de cierre o completado del registro. */
    @Property()
    closedAtShowsTime: boolean = true;

    /** Registros hijos de este. */
    @OneToMany(() => JEntry, entry => entry.parent)
    children = new Collection<JEntry>(this);

    public update(json: any) {
        if (json.createdAt !== undefined)
            this.createdAt = new Date(json.createdAt);
        if (json.createdAtShowsTime !== undefined)
            this.createdAtShowsTime = json.createdAtShowsTime;
        //entry.parent = json.parent;
        if (json.topic !== undefined)
            this.topic = json.topic;
        //entry.tags = json.tags;
        //entry.status = json.status;
        if (json.closedAt !== undefined)
            this.closedAt = new Date(json.closedAt);
        if (json.closedAtShowsTime !== undefined)
            this.closedAtShowsTime = json.closedAtShowsTime;
    }
}
