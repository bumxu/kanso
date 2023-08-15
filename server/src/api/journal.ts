import { serialize } from '@mikro-orm/core';
import { FastifyPluginCallback, FastifyPluginOptions, RouteHandlerMethod } from 'fastify';
import { JEntry } from '../model/JEntry';

const middleware: FastifyPluginCallback<FastifyPluginOptions> = function (fastify, opts, done) {
    fastify.get('/search', searchHandler);
    done();
};
export default middleware;

const searchHandler: RouteHandlerMethod = async (request, reply) => {
    // Filters

    // Sort

    // Pagination

    const entries = await request.em.fork().getRepository(JEntry).find({}, {
        populate: ['lifecycle', 'locations', 'source']
    });
    reply.send(serialize(entries, {
        populate: ['lifecycle', 'locations', 'source'],
        forceObject: true
    }));
};