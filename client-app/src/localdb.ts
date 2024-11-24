// db.ts
import Dexie, { type EntityTable } from 'dexie';
import User from './assets/model/User';

const db = new Dexie('Database') as Dexie & {
  Users: EntityTable<User, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  Users: 'uid, fullName, email, emailVerified, photoUrl, incomeCategories, expenceCategories'
});

export { db };
