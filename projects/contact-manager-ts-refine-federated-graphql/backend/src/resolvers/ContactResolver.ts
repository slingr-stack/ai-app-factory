import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Contact } from '../entities/Contact';
import { EntityManager } from '@mikro-orm/core';

@Resolver(Contact)
export class ContactResolver {
  @Query(() => [Contact])
  async contacts(@Arg('filter', { nullable: true }) filter: string, { orm }: { orm: EntityManager }): Promise<Contact[]> {
    const qb = orm.createQueryBuilder(Contact);
    if (filter) {
      qb.where('firstName = ?', [filter]).orWhere('lastName = ?', [filter]);
    }
    return qb.getResultList();
  }

  @Mutation(() => Contact)
  async createContact(@Arg('data') data: Omit<Contact, 'id'>, { orm }: { orm: EntityManager }): Promise<Contact> {
    const contact = orm.create(Contact, data);
    await orm.persistAndFlush(contact);
    return contact;
  }

  @Mutation(() => Contact)
  async updateContact(@Arg('id') id: number, @Arg('data') data: Partial<Contact>, { orm }: { orm: EntityManager }): Promise<Contact> {
    const contact = await orm.findOneOrFail(Contact, id);
    orm.assign(contact, data);
    await orm.persistAndFlush(contact);
    return contact;
  }

  @Mutation(() => Boolean)
  async deleteContact(@Arg('id') id: number, { orm }: { orm: EntityManager }): Promise<boolean> {
    const contact = await orm.findOne(Contact, id);
    if (!contact) return false;
    await orm.removeAndFlush(contact);
    return true;
  }
}
