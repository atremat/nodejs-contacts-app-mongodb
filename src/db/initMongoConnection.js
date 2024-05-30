import mongoose from 'mongoose';

import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB', '');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.log(
      '\x1b[42m%s\x1b[0m',
      'Mongo connection successfully established!',
    );
  } catch (e) {
    console.log(
      '\x1b[41m%s\x1b[0m',
      'Error while setting up mongo connection',
      e,
    );
    throw e;
  }
};
