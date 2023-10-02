import { serialize, wrap } from '@mikro-orm/core';
import { FastifyReply } from 'fastify/types/reply';
import * as repl from 'repl';
import { JEntry } from '../model/JEntry';
import { JEntryUpdate } from '../model/JEntryUpdate';
import { FastifyCustomRequest } from '../support/types';

export class JUpdatesAPI {

    public static async create(request: FastifyCustomRequest, reply: FastifyReply) {
        const dto = new JEntryUpdate();
        dto.update(request.body);
        dto.entry = request.em.getReference(JEntry, request.params.entryId);
        await request.em.persistAndFlush(dto);
        reply.send(serialize(dto));
    }

    public static async update(request: FastifyCustomRequest, reply: FastifyReply) {
        const dto = await request.em.getRepository(JEntryUpdate).findOne(request.params.id, {populate: ['entry']});
        if (dto == null) {
            reply.code(404).send('EntryUpdate not found');
            return;
        }
        if (request.params.id != dto.id) {
            reply.code(400).send('Id cannot be changed');
            return;
        }
        if (Number(request.params.entryId) != dto.entry.id) {
            reply.code(400).send('EntryUpdate id cannot be changed (expected ' + dto.entry.id + ' but received ' + request.params.entryId + ')');
            return;
        }
        request.body.id = request.params.id;
        dto.update(request.body);
        await request.em.persistAndFlush(dto);
        reply.send(serialize(dto));
    }

    public static async read(request: FastifyCustomRequest, reply: FastifyReply) {
        const dto = await request.em.getRepository(JEntryUpdate).findOne(request.params.id);
        if (dto == null) {
            reply.code(404).send('EntryUpdate not found');
            return;
        }
        reply.send(serialize(dto, {
            //populate: ['lifecycle', 'locations', 'source'],
            //forceObject: true
        }));
    }

    public static async delete(request: FastifyCustomRequest, reply: FastifyReply) {
        const dto = await request.em.getRepository(JEntryUpdate).findOne(request.params.id, {populate: ['entry']});
        if (dto == null) {
            reply.code(404).send('EntryUpdate not found');
            return;
        }
        if (dto.entry.id !== Number(request.params.entryId)) {
            reply.code(400).send('Entry for the given EntryUpdate doesn\'t match');
            return;
        }
        await request.em.removeAndFlush(dto);
        reply.send();
    }
}