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

export const GoogleAuthenticatedUser = mongoose.model('google_user_info', userSchema);