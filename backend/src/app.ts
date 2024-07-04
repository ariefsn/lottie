import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import fastifyEnv from '@fastify/env';
import fastifyStatic from '@fastify/static';
import { DIRS, newMongoClient } from '@helper';
import { FastifyPluginAsync } from 'fastify';
import mercurius from 'mercurius';
import GqlUpload from 'mercurius-upload';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { resolvers, schema } from './gql';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: string
      CONNECTION_STRING: string
    };
    mongo: () => MongoClient
  }
}

declare module 'mercurius' {
  interface MercuriusContext {
    mongo: () => MongoClient
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envSchema = {
  type: 'object',
  required: ['CONNECTION_STRING'],
  properties: {
    PORT: { type: 'string', default: 3000 },
    CONNECTION_STRING: { type: 'string' },
  },
}

export type AppOptions = {
  // Place your custom options for app below here.
  logger: boolean
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  logger: false,
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts,
    forceESM: true
  })

  // Env
  void fastify.register(fastifyEnv, {
    confKey: 'config',
    schema: envSchema,
  }).after(() => {
    fastify.log.info(`Env Loaded`)
  })

  // MongoDB
  void fastify.register((fastify, opts, done) => {
    // fastify.mongo = () => newMongoClient(fastify.config.CONNECTION_STRING)
    fastify.decorate('mongo', () => newMongoClient(fastify.config.CONNECTION_STRING))
    done()
  })

  // Fastify Static
  void fastify.register(fastifyStatic, {
    root: DIRS.UPLOADS,
    prefix: '/uploads/',
  })

  // GQL Upload
  void fastify.register(GqlUpload, {
    maxFileSize: 1024 * 1024 * 5,
    maxFiles: 10,
  })

  // GQL
  void fastify.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
    subscription: true,
    context(request, reply) {
      return {
        mongo: () => newMongoClient(fastify.config.CONNECTION_STRING),
      }
    },
  })
};

export default app;
export { app, options };

