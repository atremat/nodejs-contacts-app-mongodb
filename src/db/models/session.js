import { Schema, model } from 'mongoose';

export const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      unique: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    accessTokenValidUntil: {
      type: Date,
      required: true,
    },

    refreshTokenValidUntil: {
      type: Date,
      requred: true,
    },
  },
  {
    versionKey: false,
  },
);

export const Session = model('session', sessionSchema);
