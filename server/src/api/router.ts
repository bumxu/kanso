import { serialize } from '@mikro-orm/core';
import { FastifyPluginCallback, FastifyPluginOptions, RouteHandlerMethod } from 'fastify';
import { JEntry } from '../model/JEntry';
import { JEntitiesAPI } from './JEntitiesAPI';
import { JEntriesAPI } from './JEntriesAPI';
import { JUpdatesAPI } from './JUpdatesAPI';

const middleware: FastifyPluginCallback<FastifyPluginOptions> = function (fastify, opts, done) {

    fastify.options('/*', (request, reply) => reply.send());

    fastify.get('/entries', JEntriesAPI.search);

    fastify.post('/entries', JEntriesAPI.create);
    fastify.get('/entries/:id', JEntriesAPI.read);
    fastify.put('/entries/:id', JEntriesAPI.update);
    fastify.delete('/entries/:id', JEntriesAPI.delete);

    fastify.post('/entries/:entryId/updates', JUpdatesAPI.create);
    fastify.get('/entries/:entryId/updates/:id', dummy);
    fastify.put('/entries/:entryId/updates/:id', JUpdatesAPI.update);
    fastify.delete('/entries/:entryId/updates/:id', JUpdatesAPI.delete);

    fastify.get('/entities', JEntitiesAPI.search);

    fastify.post('/entries/:id/entities', dummy);
    fastify.get('/entries/:id/entities/:id', dummy);
    fastify.put('/entries/:id/entities/:id', dummy);
    fastify.delete('/entries/:id/entities/:id', dummy);

    fastify.get('/tags', dummy);
    fastify.post('/tags', dummy);
    fastify.get('/tags/:id', dummy);
    fastify.put('/tags/:id', dummy);
    fastify.delete('/tags/:id', dummy);

    fastify.post('/statuses', dummy);
    fastify.get('/statuses/:id', dummy);
    fastify.put('/statuses/:id', dummy);
    fastify.delete('/statuses/:id', dummy);

    done();
};
export default middleware;

const dummy = (req, res) => {
    res.code(400).send('dummy');
};

//