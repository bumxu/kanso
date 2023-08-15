import { MikroORM, serialize } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { SqliteDriver } from '@mikro-orm/sqlite';
import fastify from 'fastify';
import findRoot from 'find-root';
import * as Path from 'path';
import { JEntry } from './model/JEntry';
import { JEntryLifecycle } from './model/JEntryLifecycle';
import { JEntryLocation } from './model/JEntryLocation';
import { JEntrySource } from './model/JEntrySource';

(async () => {

    const orm = await MikroORM.init<SqliteDriver>({
        type: 'sqlite',
        dbName: Path.join(findRoot(__dirname), './data/database.sqlite'),
        entities: [JEntry, JEntryLifecycle, JEntryLocation, JEntrySource],
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
    //await orm.getMigrator().up();

    const server = fastify();

    // Add entity manager transaction to each request
    server.addHook('onRequest', async (request, reply) => {
        request.orm = orm;
        request.em = orm.em.fork();
    });

    //fastify.register(require('./support/sass-middleware'));

    // server.get('/search', async (request, reply) => {
    //     const entries = await orm.em.fork().getRepository(JEntry).find({}, {
    //         //populate: ['lifecycle', 'locations', 'source']
    //     });
    //     reply.send(serialize(entries, {
    //         //populate: ['lifecycle', 'locations', 'source'],
    //         forceObject: true
    //     }));
    // });

    server.register(require('./api/journal'), {prefix: '/journal'});

    // CORS any
    server.register(require('@fastify/cors'), {
        origin: '*'
    });

    // server.register(require('@fastify/static'), {
    //     root: Path.join(__dirname, '../../client/build'),
    //     //prefix: '/public/', // optional: default '/'
    //     //constraints: { host: 'example.com' } // optional: default {}
    // });

    await server.listen({port: 3000});

    console.log('Ready');
})();