import { connect } from 'mongoose';
import { MongoDBUser, GoogleRegisterFields, LocallyRegisterFields } from './interfaces';
import { RegisteredUserModel } from './RegisteredUserSchema';
import dotenv from 'dotenv';

dotenv.config();

const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;

export async function getUserFromDB(): Promise<MongoDBUser[]> {
   return new Promise((resolve, reject) => {
      connect(dbURI)
      .then(() => RegisteredUserModel.find())
      .then((response: any) => resolve(response))
      .catch(() => {
         reject('Could not find the user');
      });
   });
}

export function createGoogleUser(userInfo: GoogleRegisterFields) {
   return new Promise((resolve, reject) => {
      connect(dbURI)
      .then(() => userInfo.save())
      .then(() => resolve('Success creating the google authenticated user'))
      .catch((err: any) => {
         reject('Could not create the google authenticated user')
         console.log(err);
      });
   });
}

export function registerUser(registerFormBody: LocallyRegisterFields) {
   return new Promise((resolve, reject) => {
      connect(dbURI)
      .then(() => registerFormBody.save())
      .then(() => resolve("User registered successfuly"))
      .catch((error: any) => {
         reject("Couldn't register the user");
         console.log(error);
      });
   });
}