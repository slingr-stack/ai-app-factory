import Fastify from 'fastify';
import { ApolloServer } from 'apollo-server-fastify';
import { buildSchema } from 'type-graphql';
import { MikroORM } from '@mikro-orm/core';
import { ContactResolver } from './resolvers/ContactResolver';
import { CompanyResolver } from './resolvers/CompanyResolver';
import ormConfig from './mikro-orm.config';

const startServer = async () => {
  const fastify = Fastify();
  const orm = await MikroORM.init(ormConfig);
  const schema = await buildSchema({
    resolvers: [ContactResolver, CompanyResolver],
  });
  const server = new ApolloServer({
    schema,
    context: () => ({ orm }),
  });
  fastify.register(server.createHandler());
  fastify.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });
};

startServer().catch(console.error);
