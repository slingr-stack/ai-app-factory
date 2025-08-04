import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Contact {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property()
  phoneNumber?: string;
}
