import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true
   },

   lastName: {
      type: String,
      required: true
   },

   username: {
      type: String,
      required: true
   },

   password: {
      type: String,
      required: true
   },

}, { timestamps: true });

export const RegisteredUserModel = mongoose.model('registered_users', userSchema)
