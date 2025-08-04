import { MikroORM } from '@mikro-orm/core';
import { SQLiteDriver } from '@mikro-orm/sqlite';
import { Contact } from './entities/Contact';

const ormConfig: Parameters<typeof MikroORM.init>[0] = {
  entities: [Contact],
  dbName: ':memory:',
  type: 'sqlite',
  debug: true,
};

export default ormConfig;
