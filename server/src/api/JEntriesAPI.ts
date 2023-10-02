import { serialize, wrap } from '@mikro-orm/core';
import { FastifyReply } from 'fastify/types/reply';
import * as repl from 'repl';
import { JEntry } from '../model/JEntry';
import { FastifyCustomRequest } from '../support/types';

export class JEntriesAPI {

    // RouteHandlerMethod
    public static async search(request: FastifyCustomRequest, reply: FastifyReply) {
        // Filters

        // Sort

        // Pagination

        const entries = await request.em.getRepository(JEntry).find({}, {
            populate: ['updates', 'entities.entity', 'tags']
        });
        reply.send(serialize(entries, {
            populate: ['updates', 'entities.entity', 'tags']
            //forceObject: true
        }));
    }

    public static async create(request: FastifyCustomRequest, reply: FastifyReply) {
        const entry = new JEntry();
        entry.update(request.body);
        await request.em.persistAndFlush(entry);
        reply.send(serialize(entry));
    }

    public static async update(request: FastifyCustomRequest, reply: FastifyReply) {
        const entry = await request.em.getRepository(JEntry).findOne(request.params.id);
        if (entry == null) {
            reply.code(404).send('Entry not found');
            return;
        }
        if (request.params.id != entry.id) {
            reply.code(400).send('Id cannot be changed');
            return;
        }
        request.body.id = request.params.id;
        entry.update(request.body);
        await request.em.persistAndFlush(entry);
        reply.send(serialize(entry));
    }

    public static async read(request: FastifyCustomRequest, reply: FastifyReply) {
        const entry = await request.em.getRepository(JEntry).findOne(request.params.id);
        if (entry == null) {
            reply.code(404).send('Entry not found');
            return;
        }
        reply.send(serialize(entry, {
            //populate: ['lifecycle', 'locations', 'source'],
            //forceObject: true
        }));
    }

    public static async delete(request: FastifyCustomRequest, reply: FastifyReply) {
        const entry = await request.em.getRepository(JEntry).findOne(request.params.id);
        if (entry == null) {
            reply.code(404).send('Entry not found');
            return;
        }
        await request.em.removeAndFlush(entry);
        reply.send();
    }
}