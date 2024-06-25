import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const password = await bcrypt.hash(userData.password, 10);

  return User.create({ ...userData, password });
};
