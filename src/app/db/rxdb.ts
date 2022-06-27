import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { RxDBEncryptionPlugin } from 'rxdb/plugins/encryption';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import * as RxIdbAdapter from 'pouchdb-adapter-idb';

import {
  UserCollection,
  UserDocType,
  UserCollectionMethods,
  LocalDbCollections,
  LocalDb,
  ActivityDocType,
  ActivityCollectionMethods,
  ActivityCollection,
  AuraCollectionMethods,
  AuraCollection,
  AuraDocType,
} from './types';
import { activitySchema, auraSchema, userSchema } from './schemas';
import { nanoid } from 'nanoid';

addRxPlugin(RxDBEncryptionPlugin);
addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addPouchPlugin(RxIdbAdapter);

let dbPromise: Promise<RxDatabase<LocalDbCollections>>;

const userCollectionMethods: UserCollectionMethods = {
  getCount: async function (this: UserCollection) {
    const allDocs = await this.find().exec();
    console.log('Total users Count: ', allDocs.length);
    return allDocs.length;
  },
  addDoc: async function (this: UserCollection, doc: UserDocType) {
    const sdoc: any = {};
    console.log(doc);
    return sdoc;
  },
};

const activityCollectionMethods: ActivityCollectionMethods = {
  addDoc: async function (
    this: ActivityCollection,
    doc: ActivityDocType,
    user: UserDocType,
  ) {
    console.log(user);
    return doc;
  },
};

const auraCollectionMethods: AuraCollectionMethods = {
  addDoc: async function (
    this: AuraCollection,
    doc: AuraDocType,
  ) {
    return doc;
  }
};

const createDB = async () => {
  console.log('DatabaseService: creating database..');

  const db: LocalDb = await createRxDatabase<LocalDbCollections>({
    name: 'mixapdb', // <- name
    storage: getRxStoragePouch('idb'),
    password: 'passpasspass', // <- password (optional)
    multiInstance: false, // This should be set to false when you have single-instances like a single-window electron-app
    eventReduce: true, // <- eventReduce (optional, default: true),
  });

  // create collections
  // console.log("DatabaseService: create collections");
  await db.addCollections({
    users: {
      schema: userSchema,
      // methods: userDocMethods,
      statics: userCollectionMethods,
    },
    activities: {
      schema: activitySchema,
      // methods: userDocMethods,
      statics: activityCollectionMethods,
    },
    auras: {
      schema: auraSchema,
      // methods: auraDocMethods,
      statics: auraCollectionMethods,
    },
  });

  db.collections.users.insert({
    id: nanoid(),
    name: 'bar',
    email: 'bar@bar.com',
    password: 'password',
    role: 'teacher',
  });

  console.dir('db dir', db);
  console.log('DatabaseService: created database');
  window['db'] = db; // write to window for debugging

  return db;
};

const deleteDB = async () => {
  if (!dbPromise) return false;
  const db = await dbPromise;
  await db.destroy();
  await db.remove();
  return true;
};

const getDB = async () => {
  if (!dbPromise) dbPromise = createDB();
  return dbPromise;
};

export { getDB, deleteDB };
