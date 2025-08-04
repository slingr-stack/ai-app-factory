import Fastify from 'fastify';
import { MikroORM } from '@mikro-orm/core';
import { SQLiteDriver } from '@mikro-orm/sqlite';
import { Contact } from './entities/Contact.ts';
import { ContactDto } from './dto/ContactDto';
import { validateOrReject } from 'class-validator';
import ormConfig from './orm.config';

const fastify = Fastify();

const setupServer = async () => {
  const orm = await MikroORM.init<SQLiteDriver>(ormConfig);
  const em = orm.em.fork();

  fastify.get('/api/contacts', async (request, reply) => {
    const contacts = await em.find(Contact, {});
    return contacts;
  });

  fastify.post('/api/contacts', async (request, reply) => {
    try {
      const contactDto = Object.assign(new ContactDto(), request.body);
      await validateOrReject(contactDto);
      const contact = em.create(Contact, request.body);
      await em.persistAndFlush(contact);
      reply.status(201).send(contact);
    } catch (errors) {
      reply.status(400).send(errors);
    }
  });

  fastify.put('/api/contacts/:id', async (request, reply) => {
    try {
      const contactDto = Object.assign(new ContactDto(), request.body);
      await validateOrReject(contactDto);
      const contact = await em.findOneOrFail(Contact, +request.params.id);
      em.assign(contact, request.body);
      await em.flush();
      reply.send(contact);
    } catch (errors) {
      reply.status(400).send(errors);
    }
  });

  fastify.delete('/api/contacts/:id', async (request, reply) => {
    const contact = await em.findOne(Contact, +request.params.id);
    if (contact) {
      await em.removeAndFlush(contact);
      reply.status(204).send();
    } else {
      reply.status(404).send({ message: 'Contact not found' });
    }
  });

  await fastify.listen(3000);
  console.log('Server is running on http://localhost:3000');
};

setupServer().catch(err => console.log(err));
