import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from '../db/models/session.js';
import {
  APP_DOMAIN,
  EMAIL_VARS,
  FIFTEEN_MINUTES,
  JWT_SECRET,
  ONE_MONTH,
  TEMPLATES_DIR,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import path from 'path';
import fs from 'fs/promises';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendEmail.js';

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
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

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ userId: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({ userId: sessionId, refreshToken });

  return Session.create({
    userId: session.userId,
    ...createSession(),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ userId: sessionId });
};

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'send-reset-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env(APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(EMAIL_VARS.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    throw createHttpError(
      500,

      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env(JWT_SECRET));
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(
        401,

        'Token is expired or invalid.',
      );
    }
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });

  await Session.deleteOne({ userId: user._id });
};
