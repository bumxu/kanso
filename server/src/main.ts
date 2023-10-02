import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { SqliteDriver } from '@mikro-orm/sqlite';
import fastify from 'fastify';
import findRoot from 'find-root';
import * as Path from 'path';
import { JEntity } from './model/JEntity';
import { JEntry } from './model/JEntry';
import { JEntryEntity } from './model/JEntryEntity';
import { JEntryUpdate } from './model/JEntryUpdate';
import { JStatus } from './model/JStatus';
import { JTag } from './model/JTag';

(async () => {

    const orm = await MikroORM.init<SqliteDriver>({
        type: 'sqlite',
        dbName: Path.join(findRoot(__dirname), './data/database.sqlite'),
        entities: [JEntry, JEntryEntity, JEntity, JEntryUpdate, JStatus, JTag],
        highlighter: new SqlHighlighter(),
        metadataProvider: TsMorphMetadataProvider,
        debug: true,
        migrations: {
            emit: 'js',
            glob: '!(*.d).{js,ts}',
            path: Path.join(findRoot(__dirname), './data/migrations')
        }
    });

    await orm.getMigrator().createMigration();
    await orm.getMigrator().up();

    const server = fastify();

    // Add entity manager transaction to each request
    server.addHook('onRequest', async (request, reply) => {
        request.orm = orm;
        request.em = orm.em.fork();

        reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'Content-Type');
    });

    //fastify.register(require('./support/sass-middleware'));

    // fastify.register(require('@fastify/static'), {
    //     root: path.join(__dirname, 'shared/static'),
    //     //prefix: '/public/', // optional: default '/'
    //     //constraints: { host: 'example.com' } // optional: default {}
    // });


    // server.get('/search', async (request, reply) => {
    //     const entries = await orm.em.fork().getRepository(JEntry).find({}, {
    //         //populate: ['lifecycle', 'locations', 'source']
    //     });
    //     reply.send(serialize(entries, {
    //         //populate: ['lifecycle', 'locations', 'source'],
    //         forceObject: true
    //     }));
    // });

    server.register(require('./api/router'), {prefix: '/journal'});

    server.setErrorHandler(function (error, request, reply) {
        // Log error
        this.log.error(error);
        console.error(error);
        // Send error response
        reply.status(500).send({ok: false});
    });

    await server.listen({port: 3000});
})();