import { Request, Response } from 'express';
import { getUserFromDB, createGoogleUser, registerUser } from '../models/models';
import { GoogleAuthenticatedUserModel } from '../models/GoogleAuthUserSchema';
import { RegisteredUserModel } from '../models/RegisteredUserSchema';
import { MongoDBUser } from '../models/interfaces';
import { hashPassword } from '../lib/encryptPassword';


export default {
   async getUser(req: Request, res: Response) {
      getUserFromDB()
      .then((result: Array<MongoDBUser>) => res.json(result))
      .catch((err: any) => console.log(err));
   },

   async googleLogin(req: Request, res: Response) {
      const userInfoObj = new GoogleAuthenticatedUserModel({
         "firstName": req.body.firstName,
         "lastName": req.body.lastName,
         "tokenID": req.body.tokenID,
         "profilePicURL": req.body.profilePicURL,
         "email": req.body.email
      });

      await createGoogleUser(userInfoObj);
      res.end();
   },

   async registerUser(req: Request, res: Response) {
      const postData = new RegisteredUserModel({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         username: req.body.username,
         password: hashPassword(req.body.password)
      });
      await registerUser(postData);
   }
}
