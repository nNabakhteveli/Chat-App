import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
   username: {
      type: String,
      required: true
   },

   password: {
      type: String,
      required: true
   },

}, { timestamps: true });

export const NormalUser = mongoose.model('user_info', userSchema)
