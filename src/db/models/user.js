import { Schema, model } from 'mongoose';
import { EMAIL_REGEX } from '../../constants';

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      match: [EMAIL_REGEX, 'Please fill a valid email address'],
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model('user', userSchema);
