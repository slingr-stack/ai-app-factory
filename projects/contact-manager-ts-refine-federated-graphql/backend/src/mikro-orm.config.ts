import { MikroORMOptions } from '@mikro-orm/core';
import { Contact } from './entities/Contact';

const config: MikroORMOptions = {
  entities: [Contact],
  dbName: process.env.DB_PATH,
  type: 'sqlite',
};

export default config;
