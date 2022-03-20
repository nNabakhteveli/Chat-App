import { connect } from 'mongoose';
import { MongoDBUser, GoogleRegisterFields } from './interfaces';
import { NormalUser } from './normalUserSchema';
import dotenv from 'dotenv';

dotenv.config();

const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;

export async function getUserFromDB(): Promise<MongoDBUser[]> {
   return new Promise((resolve, reject) => {
      connect(dbURI)
      .then(() => NormalUser.find())
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

