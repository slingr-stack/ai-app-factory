import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Contact {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  phone!: string;
}
