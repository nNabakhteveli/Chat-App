import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
