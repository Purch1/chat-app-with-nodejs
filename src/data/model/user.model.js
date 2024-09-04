import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {

    avatar: {
      type: String,
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female"]
    },

  },

  {
    timestamps: true,
  },
);

export const User = model('User', userSchema);
