
import express, { Application} from 'express';
import bodyParser from 'body-parser';
import { NormalUser } from './models/normalUser';
import { GoogleAuthenticatedUser } from './models/googleUser';
import { hashPassword } from './lib/encryptPassword';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app: Application = express();
const PORT: number = 3001 || Number(process.env.PORT);
const dbURI: string = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPass}@chatapp-cluster.j5wns.mongodb.net/chatapp-db?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

app.get('/users', async (req, res) => {
   await mongoose.connect(dbURI);
   NormalUser.find().then((response: any) => { res.send(response) });
});

app.get('/api/app-params', (req, res) => {
   res.json({
      "GoogleClientID": process.env.GoogleClientID
   });
});

app.post('/api/google-login', async (req, res) => {
   await mongoose.connect(dbURI);
   
   const userInfo = new GoogleAuthenticatedUser({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "tokenID": req.body.tokenID,
      "profilePicUrl": req.body.profilePicURL,
      "email": req.body.email
   });

   console.log(userInfo);
   await userInfo.save();
});

app.post('/new-user', async (req, res) => {
   await mongoose.connect(dbURI);
   const user = new NormalUser({
      username: req.body.username,
      password: hashPassword(req.body.password)
   });
   await user.save()
});

app.listen(PORT);