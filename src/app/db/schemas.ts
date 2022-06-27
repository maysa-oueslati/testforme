import { RxJsonSchema } from 'rxdb';
import { ActivityDocType, AuraDocType, UserDocType } from './types';

export const userSchema: RxJsonSchema<UserDocType> = {
  title: 'user schema',
  description: 'user schema, for both learners and teachers',
  version: 0,
  keyCompression: false,
  type: 'object',
  primaryKey: 'email',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      maxLength: 100,
    },
    password: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    area: {
      type: 'string',
    },
  },
  attachments: {
    encrypted: false,
  },
  required: ['id', 'name', 'email', 'password', 'role'],
};

export const activitySchema: RxJsonSchema<ActivityDocType> = {
  title: 'activity schema',
  description: 'activity schema ',
  version: 0,
  keyCompression: false,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    cover: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    likes: {
      type: 'number',
    }
  },
  attachments: {
    encrypted: false,
  },
  required: ['id', 'title', 'type', 'description'],
};

export const auraSchema: RxJsonSchema<AuraDocType> = {
  title: 'aura schema',
  description: 'aura schema ',
  version: 0,
  keyCompression: false,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    activityId: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    content: {
      type: 'object | string',
    },
    cfg: {
      type: 'object',
    }
  },
  attachments: {
    encrypted: false,
  },
  required: ['id', 'activityId', 'type'],
};
