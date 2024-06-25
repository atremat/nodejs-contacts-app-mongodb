import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(20).toString('base64'),
    refreshToken: crypto.randomBytes(20).toString('base64'),
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_MONTH,
  };
};

export const registerUser = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const password = await bcrypt.hash(userData.password, 10);

  return User.create({ ...userData, password });
};

export const loginUser = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isEqual = await bcrypt.compare(userData.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    ...createSession(),
  });
};
