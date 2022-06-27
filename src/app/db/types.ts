import { RxCollection, RxDocument, RxDatabase } from 'rxdb/dist/types/types';

export type UserDocType = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'learner';
  phone?: string;
  address?: string;
  area?: string;
};

export type ActivityDocType = {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  cover?: string;
  content?: any;
  likes: number;
};

export type AuraDocType = {
  id: string | number;
  activityId: string | number;
  type:
    | 'AText'
    | 'A3d'
    | 'AImage'
    | 'AButton'
    | 'AQuiz'
    | 'AFile'
    | 'AVideo'
    | 'AAudio';
  content: object | string;
  cfg: object;
};

export type ClassDocType = {
  id: string;
  title: string;
  description: string;
  cover: string;
  link: string;
  code: string;
};

export type UserActivityDocType = {
  userId: string;
  activityId: string;
  userRole: 'creator' | 'editor' | 'viewer';
};

export type ClassActivityDocType = {
  classId: string;
  activityId: string;
};

export type UserDocMethods = any;

export type AuraDocMethods = any;

export type UserDocument = RxDocument<UserDocType, UserDocMethods>;
export type IAdapter = 'idb' | 'memory' | 'websql' | 'leveldb' | 'localstorage';

export type LocalDbCollections = {
  users: UserCollection;
  activities: ActivityCollection;
  auras: AuraCollection;
};

export type LocalDb = RxDatabase<LocalDbCollections>;

// we declare one static ORM-method for the collection
export type UserCollectionMethods = {
  getCount: (this: UserCollection) => Promise<number>;
  addDoc: (this: UserCollection, doc: UserDocType) => Promise<UserDocType>;
};

export type ActivityCollectionMethods = {
  addDoc: (
    this: ActivityCollection,
    doc: ActivityDocType,
    user: UserDocType,
  ) => Promise<ActivityDocType>;
};

export type AuraCollectionMethods = {
  addDoc: (
    this: AuraCollection,
    doc: AuraDocType
  ) => Promise<AuraDocType>;
};

// Todo
// remaining docs...

// and then merge all our types
export type UserCollection = RxCollection<
  UserDocType,
  UserDocMethods,
  UserCollectionMethods
>;

export type ActivityCollection = RxCollection<
  ActivityDocType,
  UserDocMethods,
  ActivityCollectionMethods
>;

export type AuraCollection = RxCollection<
  AuraDocType,
  AuraDocMethods,
  AuraCollectionMethods
>;
