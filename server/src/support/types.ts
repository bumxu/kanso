import { EntityManager, Logger, MikroORM } from '@mikro-orm/core';
import { FastifyRequest } from 'fastify/types/request';

export type FastifyCustomRequest =
    FastifyRequest<RouteGeneric, RawServer, RawRequest, SchemaCompiler, TypeProvider, ContextConfig, Logger> & {
    orm: MikroORM,
    em: EntityManager,
    params: any,
    body: any
}