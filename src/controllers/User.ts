import { Request, Response } from 'express';
import * as Models from '../models/models';
import { GoogleAuthenticatedUserModel } from '../models/GoogleAuthUserSchema';
import { RegisteredUserModel } from '../models/RegisteredUserSchema';
import { MongoDBUser } from '../models/interfaces';
import { hashPassword } from '../lib/encryptPassword';


export default {
   async getUser(req: Request, res: Response) {
      Models.getUserFromDB()
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

      await Models.createGoogleUser(userInfoObj);
      res.end();
   },

   async registerUser(req: Request, res: Response) {
      const encryptPassword = await hashPassword(req.body.password);
      const postData = new RegisteredUserModel({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         username: req.body.username,
         password: String(encryptPassword)
      });

      try {
         await Models.registerUser(postData);
         res.end('User registered successfuly');
      } catch (err) {
         console.log(err);
         res.end('Could not register the user');
      }

   },

   async loginHandler(req: Request, res: Response) {
      const response: any = await Models.checkLogin(req.body.username, req.body.password);

      console.log(response)
      res.send(response);
      // if (response.success === true) {
      //    res.send({
      //       'status': 'success'
      //    });
      //    return;
      // } else {
      //    res.send({
      //       statusCode: response.code,
      //       reason: response.error
      //    });
      //    return;
      // }
   }
}
