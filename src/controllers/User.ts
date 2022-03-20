import { Request, Response } from 'express';
import { getUserFromDB, createGoogleUser } from '../models/routerHandlers';
import { GoogleAuthenticatedUser } from '../models/googleUserSchema';
import { MongoDBUser } from '../models/interfaces';


export default {
   async getUser(req: Request, res: Response) {
      getUserFromDB()
      .then((result: Array<MongoDBUser>) => res.send(result))
      .catch((err: any) => console.log(err));
   },

   async googleLogin(req: Request, res: Response) {
      const userInfoObj = new GoogleAuthenticatedUser({
         "firstName": req.body.firstName,
         "lastName": req.body.lastName,
         "tokenID": req.body.tokenID,
         "profilePicURL": req.body.profilePicURL,
         "email": req.body.email
      });

      await createGoogleUser(userInfoObj);

      res.end();
   }
}
