import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
   firstName: {
      type: String,
      required: true
   },

   lastName: {
      type: String,
      required: true
   },

   tokenID: {
      type: String,
      required: true
   },

   email: {
      type: String,
      required: false
   },

   profilePicURL: {
      type: String,
      required: true
   }

}, { timestamps: true });

export const GoogleAuthenticatedUserModel = mongoose.model('google_authenticated_users', userSchema);