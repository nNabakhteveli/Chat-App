import { NextFunction, Request, Response } from 'express';
import * as Models from '../models/models';
import { GoogleAuthenticatedUserModel } from '../models/GoogleAuthUserSchema';
import { RegisteredUserModel } from '../models/RegisteredUserSchema';
import { MongoDBUser } from '../models/interfaces';
import { hashPassword } from '../lib/encryptPassword';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

interface CustomRequest extends Request {
   token?: String
}

export default {
   async getUser(req: Request, res: Response) {
      Models.getUserFromDB()
      .then((result: Array<MongoDBUser>) => res.json(result))
      .catch(err => console.log(err));
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

      const everyUser = await Models.getUserFromDB();

      for (let i = 0; i < everyUser.length; i++) {
         if (req.body.username === everyUser[i].username) {
            res.end("Username is already used, try another one");
            return;
         }
      }

      const postData = new RegisteredUserModel({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         username: req.body.username,
         password: String(encryptPassword)
      });

      try {
         await Models.registerUser(postData);
         res.status(201).send('User registered successfuly');
      } catch (err) {
         console.log(err);
         res.end('Could not register the user');
      }

   },

   async loginHandler(req: Request, res: Response) {
      const response: any = await Models.checkLogin(req.body.username, req.body.password);

      if (response.success === true) {
         res.send({
            status: 'success',
            data: response.data
         });
         return;
      } else {
         res.send({
            statusCode: response.code,
            reason: response.error
         });
         return;
      }
   },

   createJWTtoken(req: Request, res: Response) {
      const user = {
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         username: req.body.username
      }

      jwt.sign({ user }, (process.env.ACCESS_TOKEN_SECRET as string), (err: any, token: any) => {
         if (err) throw err;

         res.json({
            token
         });
      });
   },

   verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
      const bearerToken = req.headers['authorization'];

      if (typeof bearerToken !== 'undefined') {
         const token = bearerToken.split(' ')[1];

         req.token = token;
         next();
      } else {
         res.sendStatus(403);
      }
   },

   getParticularUser(req: CustomRequest, res: Response) {
      jwt.verify((req.token as string), (process.env.ACCESS_TOKEN_SECRET as string), (err: any, authData: any) => {
         if (err) {
            res.sendStatus(403);
         } else {
            res.json({
               data: authData
            });
         }
      });
   }
}
